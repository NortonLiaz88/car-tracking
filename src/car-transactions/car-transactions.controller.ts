import { Controller, Get, Post, Body, Param, Headers } from '@nestjs/common';
import { CreateCarTransactionDto } from './dto/create-car-transaction.dto';
import { BlockChain } from 'src/core/entities/blockchain';
import { Block } from 'src/core/entities/block';
import { Encrypt } from 'src/core/entities/encrypt';
import { Public } from 'src/auth/auth.controller';
import { BlockService } from 'src/core/services/block.service';
import { ApiBasicAuth, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@ApiTags('car')
@Controller('car-transactions')
export class CarTransactionsController {
  carChain = new BlockChain({ difficulty: 5, blocks: [] });
  encrypt = new Encrypt({
    encryptionMethod: process.env.ECNRYPTION_METHOD,
    secretInitialVector: process.env.INIT_VECTOR_KEY,
    secretKey: process.env.SECURITY__VECTOR_KEY,
  });
  constructor(
    private readonly userService: UsersService,
    private readonly blockService: BlockService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  async create(
    @Body() createCarTransactionDto: CreateCarTransactionDto,
    @Headers('Authorization') auth: string,
  ) {
    const [, token] = auth?.split(' ') ?? [];
    const payload = await this.jwtService.verifyAsync(token, {
      secret: `${process.env.SECRET_KEY}`,
    });
    const user = await this.userService.findOne(payload.email);

    const currentData = Object.assign({}, createCarTransactionDto, {
      userRef: user._id,
    });
    const encryptedData = this.encrypt.encryptData(currentData);
    const newBlock = new Block({
      index: this.carChain.latestBlock().props.index + 1,
      data: encryptedData.toString(),
    });
    this.carChain.addNewBlock(newBlock);
    this.blockService.create(newBlock);
    return newBlock;
  }

  @Get()
  async findAll() {
    const blocks = await this.blockService.findAll();
    this.carChain = new BlockChain({ difficulty: 4, blocks: [] });
    const decipherData = blocks.map((ele) => {
      const newBlock = new Block({
        index: this.carChain.latestBlock().props.index + 1,
        data: ele.data.toString(),
      });
      this.carChain.addNewBlock(newBlock);
      console.log('==>', this.encrypt.decryptData(ele.data));
      return JSON.parse(this.encrypt.decryptData(ele.data));
    });
    console.log('CAR CHAIN', JSON.stringify(this.carChain));
    return decipherData;
  }

  @Get('validate')
  async validate() {
    const isValid = this.carChain.isBlockChainValid();
    return { isValid };
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blockService.findOne(id);
  }
}
