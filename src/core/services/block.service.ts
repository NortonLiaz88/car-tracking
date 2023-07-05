import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Block } from '../repository/mongo/block.interface';
import { Block as BlockModel } from '../entities/block';

@Injectable()
export class BlockService {
  constructor(
    @InjectModel('Blocks')
    private readonly blockModel: Model<Block>,
  ) {}

  private readonly logger = new Logger(BlockService.name);

  async create(createBlock: BlockModel) {
    try {
      const blockParams = new this.blockModel(
        JSON.parse(JSON.stringify(createBlock.props)),
      );
      return await blockParams.save();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new HttpException({ error: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return await this.blockModel.find().exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new HttpException({ error: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(hash: string) {
    try {
      const categories = await this.blockModel.findOne({ hash }).exec();
      return categories;
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new HttpException({ error: error }, HttpStatus.BAD_REQUEST);
    }
  }
}
