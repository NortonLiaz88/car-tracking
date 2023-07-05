import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

import { SetMetadata } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('login')
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
        access_token: await this.jwtService.signAsync(payload, {
          secret: `${process.env.SECRET_KEY}`,
        }),
      };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
