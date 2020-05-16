import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { FindUserDTO } from './dto/find-user.dto';

@Controller('users')
export class UserController {
  constructor(private usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    return await this.usersService.create(new User(createUserDTO));
  }

  @Get()
  async find(): Promise<User[]> {
    return this.usersService.find();
  }

  @Get(':username')
  async findOne(@Param() user: FindUserDTO): Promise<User> {
    return await this.usersService.findOne(user);
  }
}
