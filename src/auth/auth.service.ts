import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import argon2 = require('argon2');
import { User } from 'src/users/user.entity';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, pass: string): Promise<User | undefined> {
    const user = await this.usersService.findOne({ username });
    if (user && (await this.passwordsAreEqual(user.password, pass))) {
      return user;
    }
    return undefined;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.id };
    return {
      'access_token': this.jwtService.sign(payload),
    };
  }

  private async passwordsAreEqual(
    hashedPassword: string,
    plainPassword: string
  ): Promise<boolean> {
    return await argon2.verify(hashedPassword, plainPassword);
  }
}
