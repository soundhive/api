import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<User | undefined> {
    const user = await this.usersService.findOne({ username });
    if (user && (await this.passwordsAreEqual(user.password, pass))) {
      return user;
    }
    return undefined;
  }

  login(user: User): { access_token: string } {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async passwordsAreEqual(
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    return argon2.verify(hashedPassword, plainPassword);
  }
}
