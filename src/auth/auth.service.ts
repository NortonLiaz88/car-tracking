import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { pbkdf2Sync } from 'crypto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserCredentials(email: string, password: string) {
    const user = await this.userService.findOne(email);
    const currentHash = pbkdf2Sync(
      password,
      `${process.env.SALT}`,
      1000,
      64,
      `sha512`,
    ).toString(`hex`);
    if (!(user.password === currentHash)) {
      return null;
    }
    return user;
  }

  async loginWithCredentials(user: any) {
    const payload = { sub: user.email, email: user.email };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: `${process.env.SECRET_KEY}`,
      }),
    };
  }
}
