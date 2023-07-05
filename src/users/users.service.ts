import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { pbkdf2Sync, generateKeyPair } from 'crypto';

import { Model } from 'mongoose';
import { User } from './repository/mongo/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users')
    private readonly userModel: Model<User>,
  ) {}

  private readonly logger = new Logger(UsersService.name);

  async create(createUserDto: CreateUserDto) {
    try {
      const cryptoPassword = pbkdf2Sync(
        createUserDto.password,
        `${process.env.SALT}`,
        1000,
        64,
        `sha512`,
      ).toString(`hex`);
      const currentUser = Object.assign({}, createUserDto, {
        password: cryptoPassword,
      });
      const currentUserParams = new this.userModel(currentUser);

      return await currentUserParams.save();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new HttpException({ error: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new HttpException({ error: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(email: string) {
    try {
      const categories = await this.userModel.findOne({ email }).exec();
      return categories;
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new HttpException({ error: error }, HttpStatus.BAD_REQUEST);
    }
  }
}
