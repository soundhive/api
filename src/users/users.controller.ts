import { Body, Controller, Get, Param, Post, Query, UseGuards, Request, NotFoundException, Delete } from '@nestjs/common';
import { FindLastListeningsForUserDTO } from 'src/listenings/dto/find-last-listenings-user.dto';
import { FindListeningsDTO } from 'src/listenings/dto/find-listenings.dto';
import { UserListeningsResponseDTO } from 'src/listenings/dto/responses/user-listenings-response.dto';
import { ListeningsService } from 'src/listenings/listenings.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Support } from 'src/supports/support.entity'
import { SupportsService } from 'src/supports/supports.service';
import { AuthenticatedUserDTO } from 'src/auth/dto/authenticated-user.dto'
import { DeleteResult } from 'typeorm';
import { Album } from 'src/albums/album.entity';
import { AlbumsService } from 'src/albums/albums.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { FindUserDTO } from './dto/find-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private readonly listeningsService: ListeningsService,
    private readonly albumsService: AlbumsService,
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
  async findOne(@Param() userReq: { username: string }): Promise<User> {
    const user: User | undefined = await this.usersService.findOne(userReq);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  @Get(':username/albums')
  async findAlbums(@Param() findUserDTO: FindUserDTO): Promise<Album[]> {
    const user: User | undefined = await this.usersService.findOne(findUserDTO);

    return this.albumsService.findBy({ user })
  }

  @Get(':username/stats')
  async findStats(@Param() findUserDTO: FindUserDTO, @Query() findListeningsDTO: FindListeningsDTO): Promise<UserListeningsResponseDTO> {
    return this.listeningsService.findForUser({ ...findUserDTO, ...findListeningsDTO })
  }

  @Get(':username/stats/last/:count/:period')
  async findLastStats(@Param() findLastListeningsForUserDTO: FindLastListeningsForUserDTO): Promise<UserListeningsResponseDTO> {
    return this.listeningsService.findLastForUser(findLastListeningsForUserDTO)
  }

  @Get(':username/supports')
  async findSupports(@Param() findUserDTO: FindUserDTO): Promise<User[]> {
    return this.supportsService.findUserSupported(findUserDTO);
  }

  @Get(':username/supporters')
  async findSupporters(@Param() findUserDTO: FindUserDTO): Promise<User[]> {
    return this.supportsService.findUserSupporters(findUserDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':username/unsupport')
  async unSupportUser(@Param() findUserDTO: FindUserDTO, @Request() req: { user: AuthenticatedUserDTO }): Promise<DeleteResult> {
    const emitor = await this.usersService.findOne(req.user);
    const target = await this.usersService.findOne(findUserDTO)
    const support = new Support({ from: emitor, to: target })
    return this.supportsService.delete(support);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':username/support')
  async support(@Request() req: { user: AuthenticatedUserDTO }, @Param() findUserDTO: FindUserDTO): Promise<Support> {
    const emitor = await this.usersService.findOne(req.user);
    const target = await this.usersService.findOne(findUserDTO)
    const support = new Support({ from: emitor, to: target })

    return this.supportsService.create(support);
  }
}
