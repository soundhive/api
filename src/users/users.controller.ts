import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FindLastListeningsForUserDTO } from 'src/listenings/dto/find-last-listenings-user.dto';
import { ListeningsService } from 'src/listenings/listenings.service';

import { CreateUserDTO } from './dto/create-user.dto';
import { FindUserDTO } from './dto/find-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UserListeningsResponseDTO } from 'src/listenings/dto/responses/user-listenings-response.dto';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private readonly listeningsService: ListeningsService,
  ) { }

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

  @Get(':username/stats/last/:count/:period')
  async findLastStats(@Param() findLastListeningsForUserDTO: FindLastListeningsForUserDTO): Promise<UserListeningsResponseDTO> {
    return await this.listeningsService.findLastForUser(findLastListeningsForUserDTO)
  }
}
