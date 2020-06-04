import { Body, Controller, Get, NotFoundException, Post, Request, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthUserDTO } from './auth/dto/auth-user.dto';
import { AuthenticatedUserDTO } from './auth/dto/authenticated-user.dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { User } from './users/user.entity';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) { }

  @Post('auth/login')
  async login(@Body() authUserDTO: AuthUserDTO): Promise<{ access_token: string }> {
      const user : User | undefined = await this.usersService.findOne({username : authUserDTO.username })
      if (!user){
        throw new NotFoundException("No such user : " + authUserDTO.username)
      }
      return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: { user: AuthenticatedUserDTO }): Promise<User> {
    const user: User | undefined = await this.usersService.findOne(req.user);

    if (!user) {
      throw NotFoundException;
    }
    return user;
  }

  @Get('/')
  static getRoot(): { message: string } {
    return AppService.getHello();
  }
}
