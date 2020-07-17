import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Album } from 'src/albums/album.entity';
import { AlbumsService } from 'src/albums/albums.service';
import { UnauthorizedResponse } from 'src/auth/dto/unothorized-response.dto';
import { ValidatedJWTReq } from 'src/auth/dto/validated-jwt-req';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FavoritesService } from 'src/favorites/favorites.service';
import { Follow } from 'src/follows/follow.entity';
import { FollowsService } from 'src/follows/follows.service';
import { FindLastListeningsForUserDTO } from 'src/listenings/dto/find-last-listenings-user.dto';
import { FindListeningsDTO } from 'src/listenings/dto/find-listenings.dto';
import { ListeningPagination } from 'src/listenings/dto/responses/pagination-response.dto';
import { UserListeningsResponseDTO } from 'src/listenings/dto/responses/user-listenings-response.dto';
import { Listening } from 'src/listenings/listening.entity';
import { ListeningsService } from 'src/listenings/listenings.service';
import { BufferedFile } from 'src/minio-client/file.model';
import { Sample } from 'src/samples/samples.entity';
import { SamplesService } from 'src/samples/samples.service';
import { BadRequestResponse } from 'src/shared/dto/bad-request-response.dto';
import { PaginationQuery } from 'src/shared/dto/pagination-query.dto';
import { TrackPagination } from 'src/tracks/dto/pagination-response.dto';
import { Track } from 'src/tracks/track.entity';
import { TracksService } from 'src/tracks/tracks.service';
import { UpdateResult } from 'typeorm';
import { CreateUserAPIBody } from './dto/create-user-api-body';
import { CreateUserDTO } from './dto/create-user.dto';
import { FindUserDTO } from './dto/find-user.dto';
import { UpdateUserAPIBody } from './dto/update-user-api-body';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private readonly listeningsService: ListeningsService,
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
    private readonly followsService: FollowsService,
    private readonly samplesService: SamplesService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @ApiOperation({ summary: 'Sign up' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserAPIBody })
  @ApiCreatedResponse({ type: User, description: 'User object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @UseInterceptors(FileInterceptor('profile_picture'))
  @Post()
  async create(
    @Body() createUserDTO: CreateUserDTO,
    @UploadedFile() ProfilePictireFile: BufferedFile,
  ): Promise<User> {
    if (!ProfilePictireFile) {
      throw new BadRequestException('Missing profile picture file');
    }

    return this.usersService.create(createUserDTO, ProfilePictireFile);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUserAPIBody })
  @ApiOkResponse({ type: User, description: 'User object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid JWT token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profile_picture'))
  @Put(':username')
  async update(
    @Request() req: ValidatedJWTReq,
    @Param() findUserDTO: FindUserDTO,
    @Body() userData: UpdateUserDTO,
    @UploadedFile() ProfilePictireFile: BufferedFile,
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

    const result: UpdateResult = await this.usersService.update(
      findUserDTO,
      userData,
      existingUser,
      ProfilePictireFile,
    );

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

  @ApiOperation({ summary: 'Get all users' })
  @ApiCreatedResponse({ type: [User], description: 'User objects' })
  @Get()
  async find(): Promise<User[]> {
    return this.usersService.find();
  }

  @ApiOperation({ summary: 'Get a user' })
  @ApiParam({ name: 'username', type: FindUserDTO })
  @ApiOkResponse({ type: User, description: 'User object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':username')
  async findOne(
    @Request() req: ValidatedJWTReq,
    @Param() userReq: { username: string },
  ): Promise<User> {
    const user: User | undefined = await this.usersService.findOne(userReq);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const follow = await this.followsService.findOne({
      from: req.user,
      to: user,
    });

    if (follow) {
      user.following = true;
    } else {
      user.following = false;
    }

    return user;
  }

  @ApiOperation({ summary: "Get a user's tracks" })
  @ApiOkResponse({ type: [TrackPagination], description: 'User tracks' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @Get(':username/tracks')
  async findTracks(
    @Param() findUserDTO: FindUserDTO,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<Pagination<Track>> {
    const user: User | undefined = await this.usersService.findOne(findUserDTO);

    const paginatedDataReponse = await this.tracksService.paginate(
      {
        page: paginationQuery.page ? paginationQuery.page : 1,
        limit: paginationQuery.limit ? paginationQuery.limit : 10,
        route: '/users',
      },
      { where: { user } },
    );

    const items = await Promise.all(
      paginatedDataReponse.items.map(
        async (track): Promise<Track> => {
          // eslint-disable-next-line no-param-reassign
          track.listeningCount = await this.listeningsService.countForTrack(
            track,
          );
          return track;
        },
      ),
    );

    return { ...paginatedDataReponse, items };
  }

  @ApiOperation({ summary: "Get a user's albums" })
  @ApiOkResponse({ type: [Album], description: 'User albums' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @Get(':username/albums')
  async findAlbums(@Param() findUserDTO: FindUserDTO): Promise<Album[]> {
    const user: User | undefined = await this.usersService.findOne(findUserDTO);

    return this.albumsService.findBy({ user });
  }

  @ApiOperation({ summary: "Get a user's statistics" })
  @ApiOkResponse({
    type: UserListeningsResponseDTO,
    description: "Stats for all the user's things",
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
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

  @ApiOperation({ summary: "Get a user's statistics" })
  @ApiOkResponse({
    type: UserListeningsResponseDTO,
    description: "Stats for all the user's things",
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @Get(':username/stats/last/:count/:period')
  async findLastStats(
    @Param() findLastListeningsForUserDTO: FindLastListeningsForUserDTO,
  ): Promise<UserListeningsResponseDTO> {
    return this.listeningsService.findLastForUser(findLastListeningsForUserDTO);
  }

  @ApiOperation({ summary: "Get a user's followings" })
  @ApiOkResponse({
    type: [User],
    description: 'Followed users',
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @Get(':username/followings')
  async findFollowings(@Param() findUserDTO: FindUserDTO): Promise<User[]> {
    return this.followsService.findUserFollowed(findUserDTO);
  }

  @ApiOperation({ summary: "Get a user's samples" })
  @ApiOkResponse({
    type: [Sample],
    description: 'Samples',
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @Get(':username/samples')
  async findSamples(@Param() findUserDTO: FindUserDTO): Promise<Sample[]> {
    const user = await this.usersService.findOne(findUserDTO);
    return this.samplesService.findBy({ user });
  }

  @ApiOperation({ summary: "Get a user's followers" })
  @ApiOkResponse({
    type: [User],
    description: 'Users following this user',
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @Get(':username/followers')
  async findFollowers(@Param() findUserDTO: FindUserDTO): Promise<User[]> {
    return this.followsService.findUserFollowers(findUserDTO);
  }

  @ApiOperation({ summary: 'Follow someone' })
  @ApiOkResponse({ type: Follow, description: 'Follow object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid JWT token',
  })
  @ApiBearerAuth()
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

    return this.followsService.create({ from: req.user, to: target });
  }

  @ApiOperation({ summary: 'Unfollow someone' })
  @ApiNoContentResponse({ description: 'Unfollow successful' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid JWT token',
  })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: "Get the user's favorite tracks" })
  @ApiOkResponse({
    type: [Track],
    description: 'Favorite tracks',
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid JWT token',
  })
  @Get(':username/favorites')
  async favoriters(@Param() findUserDTO: FindUserDTO): Promise<Track[]> {
    const user = await this.usersService.findOne(findUserDTO);

    const favs = await this.favoritesService.findBy({ user });

    const favorites = favs.map((fav) => fav.track);

    return favorites;
  }

  @ApiOperation({ summary: "Get the user's history" })
  @ApiOkResponse({
    type: [ListeningPagination],
    description: 'Listenings',
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid JWT token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':username/history')
  async history(
    @Request() req: ValidatedJWTReq,
    @Query() paginationQuery: PaginationQuery,
    @Param() findUserDTO: FindUserDTO,
  ): Promise<Pagination<Listening>> {
    const user = await this.usersService.findOne(findUserDTO);

    if (user?.id !== req.user.id) {
      throw new ForbiddenException("You can not view someone else's history");
    }

    return this.listeningsService.paginate(
      {
        page: paginationQuery.page ? paginationQuery.page : 1,
        limit: paginationQuery.limit ? paginationQuery.limit : 10,
        route: `/users/${user.username}/history`,
      },
      {
        where: { user },
        order: {
          listenedAt: 'DESC',
        },
      },
    );
  }
}
