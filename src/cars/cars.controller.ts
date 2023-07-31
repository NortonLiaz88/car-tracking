import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  Param,
  Headers,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/auth.controller';
import { Block } from 'src/core/entities/block';
import { BlockChain } from 'src/core/entities/blockchain';
import { Encrypt } from 'src/core/entities/encrypt';
import { BlockService } from 'src/core/services/block.service';
import { UsersService } from 'src/users/users.service';
import { CreateCarDto } from './dto/create-car.dto';

@ApiBearerAuth()
@ApiTags('car')
@Controller('car')
export class CarsController {
  carChain = new BlockChain({ difficulty: 5 });
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
    @Body() createCarDto: CreateCarDto,
    @Headers('Authorization') auth: string,
  ) {
    const [, token] = auth?.split(' ') ?? [];
    const payload = await this.jwtService.verifyAsync(token, {
      secret: `${process.env.SECRET_KEY}`,
    });
    const user = await this.userService.findOne(payload.email);

    const currentData = Object.assign({}, createCarDto, {
      userRef: user._id,
      type: 'ASSET',
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
  @HttpCode(200)
  async findAll(@Headers('Authorization') auth: string) {
    console.log('MY CAR');
    const [, token] = auth?.split(' ') ?? [];

    const payload = await this.jwtService.verifyAsync(token, {
      secret: `${process.env.SECRET_KEY}`,
    });
    const user = await this.userService.findOne(payload.email);

    const blocks = await this.blockService.findAll();
    this.carChain = new BlockChain({ difficulty: 4, blocks: [] });

    const decipherData = blocks.map((ele) => {
      const newBlock = new Block({
        index: this.carChain.latestBlock().props.index + 1,
        data: ele.data.toString(),
        nonce: ele.nonce,
        ref: ele.id,
      });
      console.log('BLOCK', newBlock);
      this.carChain.addNewBlock(newBlock);
      const decrypt = JSON.parse(this.encrypt.decryptData(ele.data));
      console.log('DECRYPT', decrypt, JSON.stringify(ele._id));
      const currentData = Object.assign({}, decrypt, {
        id: ele._id.toString(),
      });
      return currentData;
    });

    const assets = decipherData.filter((ele) => ele.type === 'ASSET');

    console.log('DECYPHER DATA', decipherData);
    const userCars = assets.filter((ele) => {
      if (ele.userRef == user._id) return ele;
    });
    console.log('USER CARS', userCars);
    return userCars;
  }

  @Get('validate')
  async validate() {
    this.carChain = new BlockChain({ difficulty: 4 });
    const isValid = this.carChain.isBlockChainValid();
    return { isValid };
  }
}
