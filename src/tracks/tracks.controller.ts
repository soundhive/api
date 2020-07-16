import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ForbiddenException,
} from '@nestjs/common';
import { AlbumsService } from 'src/albums/albums.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FindLastListeningsForTrackDTO } from 'src/listenings/dto/find-last-listenings-track.dto';
import { FindListeningsDTO } from 'src/listenings/dto/find-listenings.dto';
import { TrackListeningsResponseDTO } from 'src/listenings/dto/responses/track-listenings-response.dto';
import { Listening } from 'src/listenings/listening.entity';
import { ListeningsService } from 'src/listenings/listenings.service';

import { UpdateResult } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/minio-client/file.model';
import { ValidatedJWTReq } from 'src/auth/dto/validated-jwt-req';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { BadRequestResponse } from 'src/shared/dto/bad-request-response.dto';
import { UnauthorizedResponse } from 'src/auth/dto/unothorized-response.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PaginationQuery } from 'src/shared/dto/pagination-query.dto';
import { FavoritesService } from 'src/favorites/favorites.service';
import { Favorite } from 'src/favorites/favorite.entity';
import { FavoritedResponseDTO } from 'src/favorites/dto/favorited-response.dto';
import { User } from 'src/users/user.entity';
import { CreateTrackDTO } from './dto/create-track.dto';
import { FindTrackDTO } from './dto/find-track.dto';
import { UpdateTrackDTO } from './dto/update-track.dto';
import { Track } from './track.entity';
import { TracksService } from './tracks.service';
import { CreateTrackAPIBody } from './dto/create-track-api-body.dto';
import { UpdateTrackAPIBody } from './dto/update-track-api-body.dto';
import { TrackPagination } from './dto/pagination-response.dto';

@Controller('tracks')
export class TracksController {
  constructor(
    private readonly tracksService: TracksService,
    private readonly albumsService: AlbumsService,
    private readonly listeningsService: ListeningsService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @ApiOperation({ summary: 'Post a track' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateTrackAPIBody })
  @ApiCreatedResponse({ type: Track, description: 'Track object' })
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
  @UseInterceptors(FileInterceptor('track_file'))
  @Post()
  async create(
    @Request() req: ValidatedJWTReq,
    @Body() createTrackDTO: CreateTrackDTO,
    @UploadedFile() trackFile: BufferedFile,
  ): Promise<Track> {
    if (!trackFile) {
      throw new BadRequestException('Missing track file');
    }

    const album = await this.albumsService.findOne({
      id: createTrackDTO.album,
    });

    if (!album) {
      throw new BadRequestException('Invalid album');
    }

    return this.tracksService.create(
      {
        ...createTrackDTO,
        downloadable: createTrackDTO.downloadable === 'true',
        user: req.user,
        album,
      },
      trackFile,
    );
  }

  @ApiOperation({ summary: 'Update a track' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateTrackAPIBody })
  @ApiOkResponse({ type: Track, description: 'Track object' })
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
  @UseInterceptors(FileInterceptor('track_file'))
  @Put(':id')
  async update(
    @Request() req: ValidatedJWTReq,
    @Param() findTrackDTO: FindTrackDTO,
    @Body() trackData: UpdateTrackDTO,
    @UploadedFile() trackFile: BufferedFile,
  ): Promise<Track> {
    const existingTrack = await this.tracksService.findOne(findTrackDTO);

    if (!existingTrack) {
      throw new BadRequestException('Could not find track');
    }

    if (existingTrack.user.id !== req.user.id) {
      throw new ForbiddenException();
    }

    const result: UpdateResult = await this.tracksService.update(
      findTrackDTO,
      trackData,
      existingTrack,
      trackFile,
    );

    // There is always at least one field updated (UpdatedAt)
    if (!result.affected || result.affected < 1) {
      throw new BadRequestException('Could not update track.');
    }

    // Fetch updated track
    const updatedTrack = await this.tracksService.findOne(findTrackDTO);

    if (!updatedTrack) {
      throw new BadRequestException('Could not find track');
    }

    return updatedTrack;
  }

  @ApiOperation({ summary: 'Get all tracks' })
  @ApiOkResponse({ type: [TrackPagination], description: 'Track objects' })
  @Get()
  async find(
    @Query() paginationQuery: PaginationQuery,
  ): Promise<Pagination<Track>> {
    return this.tracksService.paginate({
      page: paginationQuery.page ? paginationQuery.page : 1,
      limit: paginationQuery.limit ? paginationQuery.limit : 10,
      route: '/tracks',
    });
  }

  @ApiOperation({ summary: 'Get a track' })
  @ApiOkResponse({ type: Track, description: 'Track object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @Get(':id')
  async findOne(@Param() findTrackDTO: FindTrackDTO): Promise<Track> {
    const track: Track | undefined = await this.tracksService.findOne(
      findTrackDTO,
    );

    if (!track) {
      throw NotFoundException;
    }

    return track;
  }

  @ApiOperation({ summary: "Get a track's statistics" })
  @ApiOkResponse({
    type: TrackListeningsResponseDTO,
    description: 'Stats for the track',
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @Get(':id/stats')
  async findStats(
    @Param() findTrackDTO: FindTrackDTO,
    @Query() findListeningsDTO: FindListeningsDTO,
  ): Promise<TrackListeningsResponseDTO> {
    return this.listeningsService.findForTrack({
      ...findTrackDTO,
      ...findListeningsDTO,
    });
  }

  @ApiOperation({ summary: "Get a track's statistics" })
  @ApiOkResponse({
    type: TrackListeningsResponseDTO,
    description: 'Stats for the track',
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @Get(':id/stats/last/:count/:period')
  async findLastStats(
    @Param() findLastListeningsForTrackDTO: FindLastListeningsForTrackDTO,
  ): Promise<TrackListeningsResponseDTO> {
    return this.listeningsService.findLastForTrack(
      findLastListeningsForTrackDTO,
    );
  }

  @ApiOperation({ summary: 'Increment listening count' })
  @ApiCreatedResponse({
    description: 'Success',
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
  @Post(':id/listen')
  async listen(
    @Param() findTrackDTO: FindTrackDTO,
    @Request() req: ValidatedJWTReq,
  ): Promise<void> {
    const track = await this.tracksService.findOne(findTrackDTO);
    const listening = new Listening({ user: req.user, track });
    await this.listeningsService.create(listening);
  }

  @ApiOperation({ summary: 'Delete track' })
  @ApiNoContentResponse({ description: 'Deletion successful' })
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
  @Delete(':id')
  async delete(
    @Request() req: ValidatedJWTReq,
    @Param() track: FindTrackDTO,
  ): Promise<void> {
    const trackToDelete = await this.tracksService.findOne(track);

    if (trackToDelete?.user.id !== req.user.id) {
      throw new ForbiddenException(['You do not own this track.']);
    }

    await this.tracksService.delete(track);
  }

  @ApiOperation({ summary: 'Favorite track' })
  @ApiCreatedResponse({
    description: 'Track favorited',
    type: Favorite,
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
  @Post(':id/favorite')
  async favorite(
    @Param() findTrackDTO: FindTrackDTO,
    @Request() req: ValidatedJWTReq,
  ): Promise<Favorite> {
    const track = await this.tracksService.findOne(findTrackDTO);
    const favorite = new Favorite({ user: req.user, track });
    return this.favoritesService.create(favorite);
  }

  @ApiOperation({ summary: 'Unavorite track' })
  @ApiNoContentResponse({
    description: 'Track unfavorited',
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
  @HttpCode(204)
  @Delete(':id/favorite')
  async unfavorite(
    @Param() findTrackDTO: FindTrackDTO,
    @Request() req: ValidatedJWTReq,
  ): Promise<void> {
    const track = await this.tracksService.findOne(findTrackDTO);
    const favorite = new Favorite({ user: req.user, track });
    const exisingFav = await this.favoritesService.findOne(favorite);

    if (!exisingFav) {
      throw new BadRequestException('This track is not in your favorites');
    }

    await this.favoritesService.delete(favorite);
  }

  @ApiOperation({ summary: 'Know if track is favorited' })
  @ApiOkResponse({
    type: FavoritedResponseDTO,
    description: 'Success',
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
  @Get(':id/isfavorited')
  async isFavorited(
    @Param() findTrackDTO: FindTrackDTO,
    @Request() req: ValidatedJWTReq,
  ): Promise<FavoritedResponseDTO> {
    const track = await this.tracksService.findOne(findTrackDTO);
    const favorite = new Favorite({ user: req.user, track });
    const exisingFav = await this.favoritesService.findOne(favorite);

    if (!exisingFav) {
      return { favorited: false };
    }

    return { favorited: true };
  }

  @ApiOperation({ summary: 'Get the users favoriting a track' })
  @ApiOkResponse({
    type: [User],
    description: 'Favoriers (users)',
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid JWT token',
  })
  @Get(':id/favoriters')
  async favoriters(@Param() findTrackDTO: FindTrackDTO): Promise<User[]> {
    const track = await this.tracksService.findOne(findTrackDTO);

    const favs = await this.favoritesService.findBy({ track });

    const favoriters = favs.map((fav) => fav.user);

    return favoriters;
  }
}
