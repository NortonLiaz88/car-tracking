import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiBadRequestResponse,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/auth/auth.guard';
import { CreateUserResponseDto } from './dto/create-response.dto';
import { ApiErrorDecorator } from 'src/errors/decorators/error.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  private readonly logger = new Logger(UsersController.name);

  @Public()
  @Post()
  @ApiExtraModels(CreateUserResponseDto, BadRequestException)
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'User created successful',
    schema: { $ref: getSchemaPath(CreateUserResponseDto) },
  })
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  async create(@Body() createWaterDto: CreateUserDto) {
    try {
      this.logger.log(`data: ${JSON.stringify(createWaterDto)}`);
      const { name, email } = await this.userService.create(createWaterDto);
      return { name, email };
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new HttpException({ error: error }, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @Get()
  @ApiExtraModels(CreateUserResponseDto, NotFoundException)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Users list request successful',
    isArray: true,
    type: CreateUserResponseDto,
  })
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  async findAll() {
    try {
      this.logger.log(`load all users`);
      const data = await this.userService.findAll();
      return data;
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new HttpException({ error: error }, HttpStatus.BAD_REQUEST);
    }
  }
}
