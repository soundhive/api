import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiOperation,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthUserDTO } from './auth/dto/auth-user.dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { User } from './users/user.entity';
import { ValidatedJWTReq } from './auth/dto/validated-jwt-req';
import { UnauthorizedResponse } from './auth/dto/unothorized-response.dto';
import { LoggedInTokenResponse } from './auth/dto/logged-in-token-response.dto';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private appService: AppService,
  ) {}

  @ApiOperation({ summary: 'Authenticate and get token' })
  @ApiCreatedResponse({
    type: LoggedInTokenResponse,
    description: 'JWT token',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid username or password',
  })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  login(@Body() authUserDTO: AuthUserDTO): { access_token: string } {
    return this.authService.login(new User(authUserDTO));
  }

  @ApiOperation({ summary: 'Get profile' })
  @ApiOkResponse({ type: User, description: 'User object' })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid JWT token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: ValidatedJWTReq): User {
    return req.user;
  }

  @ApiOperation({ summary: 'Get default message' })
  @ApiOkResponse({
    description: 'Get default message',
  })
  @Get('/')
  getRoot(): { message: string } {
    return this.appService.getHello();
  }
}
