import { Body, Controller, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

import { SetMetadata } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { ErrorDTO } from 'src/errors/dto/error.dto';
import { ApiErrorDecorator } from 'src/errors/decorators/error.decorator';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@ApiExtraModels(LoginResponseDto, UnauthorizedException)
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('login')
  @ApiResponse({
    status: 201,
    description: 'User created successful',
    schema: { $ref: getSchemaPath(LoginResponseDto) },
  })
  @ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
  @ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server')
  async login(@Body() body: LoginDto) {
    try {
      const userValidation = await this.authService.validateUserCredentials(
        body.email,
        body.password,
      );
      if (!userValidation) {
        throw new UnauthorizedException();
      }
      const payload = {
        sub: userValidation['email'],
        email: userValidation['email'],
      };
      return {
        accessToken: await this.jwtService.signAsync(payload, {
          secret: `${process.env.SECRET_KEY}`,
        }),
      };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
