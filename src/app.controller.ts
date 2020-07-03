import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';

import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthUserDTO } from './auth/dto/auth-user.dto';
import { AuthenticatedUserDTO } from './auth/dto/authenticated-user.dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { User } from './users/user.entity';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    login(@Body() authUserDTO: AuthUserDTO): { access_token: string } {
        return this.authService.login(new User(authUserDTO));
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(
        @Request() req: { user: AuthenticatedUserDTO },
    ): Promise<User> {
        const user: User | undefined = await this.usersService.findOne(
            req.user,
        );

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
