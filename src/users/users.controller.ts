import { Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { FindLastListeningsForUserDTO } from 'src/listenings/dto/find-last-listenings-user.dto';
import { FindListeningsDTO } from 'src/listenings/dto/find-listenings.dto';
import { UserListeningsResponseDTO } from 'src/listenings/dto/responses/user-listenings-response.dto';
import { ListeningsService } from 'src/listenings/listenings.service';

import { CreateUserDTO } from './dto/create-user.dto';
import { FindUserDTO } from './dto/find-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private readonly listeningsService: ListeningsService,
  ) { }

  @Post()
  async create(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    return this.usersService.create(new User(createUserDTO));
  }

  @Get()
  async find(): Promise<User[]> {
    return this.usersService.find();
  }

  @Get(':username')
  async findOne(@Param() findUserDTO: FindUserDTO): Promise<User> {
    const user: User | undefined = await this.usersService.findOne(findUserDTO);

    if (!user) {
      throw NotFoundException;
    }

    return user;
  }

  @Get(':username/stats')
  async findStats(@Param() findUserDTO: FindUserDTO, @Query() findListeningsDTO: FindListeningsDTO): Promise<UserListeningsResponseDTO> {
    return this.listeningsService.findForUser({ ...findUserDTO, ...findListeningsDTO })
  }

  @Get(':username/stats/last/:count/:period')
  async findLastStats(@Param() findLastListeningsForUserDTO: FindLastListeningsForUserDTO): Promise<UserListeningsResponseDTO> {
    return this.listeningsService.findLastForUser(findLastListeningsForUserDTO)
  }
}
