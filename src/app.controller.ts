import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthUserDTO } from './auth/dto/auth-user.dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { User } from './users/user.entity';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private appService: AppService,
    private usersService: UsersService,
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  login(@Body() authUserDTO: AuthUserDTO) {
    return this.authService.login(new User(authUserDTO));
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user);
  }

  @Get('/')
  getRoot() {
    return this.appService.getHello();
  }
}
