import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
  NotFoundException,
  Delete,
  BadRequestException,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  Put,
  ForbiddenException,
} from '@nestjs/common';
import { FindLastListeningsForUserDTO } from 'src/listenings/dto/find-last-listenings-user.dto';
import { FindListeningsDTO } from 'src/listenings/dto/find-listenings.dto';
import { UserListeningsResponseDTO } from 'src/listenings/dto/responses/user-listenings-response.dto';
import { ListeningsService } from 'src/listenings/listenings.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Follow } from 'src/follows/follow.entity';
import { FollowsService } from 'src/follows/follows.service';
import { Album } from 'src/albums/album.entity';
import { AlbumsService } from 'src/albums/albums.service';
import { TracksService } from 'src/tracks/tracks.service';
import { Track } from 'src/tracks/track.entity';
import { ValidatedJWTReq } from 'src/auth/dto/validated-jwt-req';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/minio-client/file.model';
import { UpdateResult } from 'typeorm';
import { FindUserDTO } from './dto/find-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private readonly listeningsService: ListeningsService,
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
    private readonly followsService: FollowsService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('profile_picture'))
  async create(
    @Body() createUserDTO: CreateUserDTO,
    @UploadedFile() file: BufferedFile,
  ): Promise<User> {
    if (!file) {
      throw new BadRequestException('Missing profile picture file');
    }

    const filename: string = await this.usersService.uploadProfilePicture(
      file,
      'users/avatars',
    );

    return this.usersService.create(
      new User({
        ...createUserDTO,
        profilePicture: filename,
      }),
    );
  }

  @Put(':username')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profile_picture'))
  async update(
    @Request() req: ValidatedJWTReq,
    @Param() findUserDTO: FindUserDTO,
    @Body() userData: UpdateUserDTO,
    @UploadedFile() file: BufferedFile,
  ): Promise<User> {
    const existingUser = await this.usersService.findOne(findUserDTO);

    if (!existingUser) {
      throw new BadRequestException('Could not find user');
    }

    if (existingUser.id !== req.user.id) {
      throw new ForbiddenException();
    }

    if (userData.username != null) {
      throw new ForbiddenException('username modification is forbidden.');
    }

    let filename: string;
    if (file) {
      filename = await this.usersService.uploadProfilePicture(
        file,
        'users/avatars',
      );
    } else {
      filename = existingUser.profilePicture;
    }

    const result: UpdateResult = await this.usersService.update(findUserDTO, {
      ...userData,
      profilePicture: filename,
    });

    // There is always at least one field updated (UpdatedAt)
    if (!result.affected || result.affected < 1) {
      throw new BadRequestException('Could not update user.');
    }

    // Fetch updated user
    const updatedUser = await this.usersService.findOne({
      ...findUserDTO,
      ...userData,
    });

    if (!updatedUser) {
      throw new BadRequestException('Could not find user');
    }

    return updatedUser;
  }

  @Get()
  async find(): Promise<User[]> {
    return this.usersService.find();
  }

  @Get(':username')
  async findOne(@Param() userReq: { username: string }): Promise<User> {
    const user: User | undefined = await this.usersService.findOne(userReq);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get(':username/tracks')
  async findTracks(@Param() findUserDTO: FindUserDTO): Promise<Track[]> {
    const user: User | undefined = await this.usersService.findOne(findUserDTO);

    return this.tracksService.findBy({ user });
  }

  @Get(':username/albums')
  async findAlbums(@Param() findUserDTO: FindUserDTO): Promise<Album[]> {
    const user: User | undefined = await this.usersService.findOne(findUserDTO);

    return this.albumsService.findBy({ user });
  }

  @Get(':username/stats')
  async findStats(
    @Param() findUserDTO: FindUserDTO,
    @Query() findListeningsDTO: FindListeningsDTO,
  ): Promise<UserListeningsResponseDTO> {
    return this.listeningsService.findForUser({
      ...findUserDTO,
      ...findListeningsDTO,
    });
  }

  @Get(':username/stats/last/:count/:period')
  async findLastStats(
    @Param() findLastListeningsForUserDTO: FindLastListeningsForUserDTO,
  ): Promise<UserListeningsResponseDTO> {
    return this.listeningsService.findLastForUser(findLastListeningsForUserDTO);
  }

  @Get(':username/followings')
  async findFollowings(@Param() findUserDTO: FindUserDTO): Promise<User[]> {
    return this.followsService.findUserFollowed(findUserDTO);
  }

  @Get(':username/followers')
  async findFollowers(@Param() findUserDTO: FindUserDTO): Promise<User[]> {
    return this.followsService.findUserFollowers(findUserDTO);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':username/follow')
  async unfollowUser(
    @Param() findUserDTO: FindUserDTO,
    @Request() req: ValidatedJWTReq,
  ): Promise<void> {
    const emitor = req.user;
    const target = await this.usersService.findOne(findUserDTO);
    if (!target) {
      throw new BadRequestException('Could not find user.');
    }
    const follow = await this.followsService.findOne({
      from: emitor,
      to: target,
    });

    if (!follow) {
      throw new NotFoundException('You are not following this user.');
    }
    await this.followsService.delete({
      from: emitor,
      to: target,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':username/follow')
  async follow(
    @Request() req: ValidatedJWTReq,
    @Param() findUserDTO: FindUserDTO,
  ): Promise<Follow> {
    const target = await this.usersService.findOne(findUserDTO);
    if (!target) {
      throw new BadRequestException('Could not find user.');
    }
    const existingFollow = await this.followsService.findOne({
      from: req.user,
      to: target,
    });
    if (existingFollow) {
      throw new BadRequestException('You are already following this user.');
    }

    return this.followsService.create({ from: req.user, to: target });
  }
}
