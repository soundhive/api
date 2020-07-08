import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';

import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthUserDTO } from './auth/dto/auth-user.dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { User } from './users/user.entity';
import { ValidatedJWTReq } from './auth/dto/validated-jwt-req';

@Controller()
export class AppController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    login(@Body() authUserDTO: AuthUserDTO): { access_token: string } {
        return this.authService.login(new User(authUserDTO));
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    static getProfile(@Request() req: ValidatedJWTReq): User {
        return req.user;
    }

    @Get('/')
    static getRoot(): { message: string } {
        return AppService.getHello();
    }
}
