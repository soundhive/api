import { Body, Controller, Get, Param, Post, Query, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { FindLastListeningsForUserDTO } from 'src/listenings/dto/find-last-listenings-user.dto';
import { FindListeningsDTO } from 'src/listenings/dto/find-listenings.dto';
import { UserListeningsResponseDTO } from 'src/listenings/dto/responses/user-listenings-response.dto';
import { ListeningsService } from 'src/listenings/listenings.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Support } from 'src/supports/support.entity'
import { SupportsService } from 'src/supports/supports.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { FindUserDTO } from './dto/find-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private readonly listeningsService: ListeningsService,
    private readonly supportsService: SupportsService,
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

  @UseGuards(JwtAuthGuard)
  @Post(':username/support')
  async support(@Param() findUserDTO: FindUserDTO, @Request() req): Promise<void> {
    const emitor = await this.usersService.findOne(req.user);
    const target = await this.usersService.findOne(findUserDTO)
    const support = new Support({from: emitor, to: target})
    await this.supportsService.create(new Support(support));
  }


}
