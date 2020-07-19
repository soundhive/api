/* eslint-disable no-param-reassign */
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
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UnauthorizedResponse } from 'src/auth/dto/unothorized-response.dto';
import { ValidatedJWTReq } from 'src/auth/dto/validated-jwt-req';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FavoritesService } from 'src/favorites/favorites.service';
import { ListeningsService } from 'src/listenings/listenings.service';
import { BufferedFile } from 'src/minio-client/file.model';
import { BadRequestResponse } from 'src/shared/dto/bad-request-response.dto';
import { PaginationQuery } from 'src/shared/dto/pagination-query.dto';
import { TrackPagination } from 'src/tracks/dto/pagination-response.dto';
import { Track } from 'src/tracks/track.entity';
import { TracksService } from 'src/tracks/tracks.service';
import { UpdateResult } from 'typeorm';
import { Album } from './album.entity';
import { AlbumsService } from './albums.service';
import { CreateAlbumAPIBody } from './dto/create-album-api-body.dto';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { FindAlbumDTO } from './dto/find-album.dto';
import { AlbumPagination } from './dto/pagination-response.dto';
import { UpdateAlbumAPIBody } from './dto/update-album-api-body.dto';
import { UpdateAlbumDTO } from './dto/update-album.dto';

@Controller('albums')
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
    private readonly listeningsService: ListeningsService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @ApiOperation({ summary: 'Post a album' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateAlbumAPIBody })
  @ApiCreatedResponse({ type: () => Album, description: 'Album object' })
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
  @UseInterceptors(FileInterceptor('cover_file'))
  @Post()
  async create(
    @Request() req: ValidatedJWTReq,
    @Body() createAlbumDTO: CreateAlbumDTO,
    @UploadedFile() coverFile: BufferedFile,
  ): Promise<Album> {
    if (!coverFile) {
      throw new BadRequestException('Missing cover_file');
    }

    const album = await this.albumsService.create(
      {
        ...createAlbumDTO,
        user: req.user,
      },
      coverFile,
    );

    return new Album(album);
  }

  @ApiOperation({ summary: 'Get all albums' })
  @ApiOkResponse({ type: [AlbumPagination], description: 'Album objects' })
  @Get()
  async find(
    @Query() paginationQuery: PaginationQuery,
  ): Promise<Pagination<Album>> {
    return this.albumsService.paginate({
      page: paginationQuery.page ? paginationQuery.page : 1,
      limit: paginationQuery.limit ? paginationQuery.limit : 10,
      route: '/albums',
    });
  }

  @ApiOperation({ summary: 'Get an album' })
  @ApiOkResponse({ type: () => Album, description: 'Track object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @Get(':id')
  async findOne(@Param() findAlbumDTO: FindAlbumDTO): Promise<Album> {
    const album: Album | undefined = await this.albumsService.findOne(
      findAlbumDTO,
    );

    if (!album) {
      throw NotFoundException;
    }

    return album;
  }

  @ApiOperation({ summary: "Get an album's tracks" })
  @ApiOkResponse({ type: [TrackPagination], description: 'Track objects' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @Get(':id/tracks')
  async findTracks(
    @Param() findAlbumDTO: FindAlbumDTO,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<Pagination<Track>> {
    const album: Album | undefined = await this.albumsService.findOne(
      findAlbumDTO,
    );

    if (!album) {
      throw new NotFoundException();
    }

    const paginatedDataReponse = await this.tracksService.paginate(
      {
        page: paginationQuery.page ? paginationQuery.page : 1,
        limit: paginationQuery.limit ? paginationQuery.limit : 10,
        route: `/albums/${album.id}/tracks`,
      },
      { where: { album } },
    );

    const items = await Promise.all(
      paginatedDataReponse.items.map(
        async (track): Promise<Track> => {
          track.listeningCount = await this.listeningsService.countForTrack(
            track,
          );
          track.favoriteCount = await this.favoritesService.countForTrack(
            track,
          );
          return track;
        },
      ),
    );

    return { ...paginatedDataReponse, items };
  }

  @ApiOperation({ summary: 'Update an album' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateAlbumAPIBody })
  @ApiOkResponse({ type: () => Album, description: 'Album object' })
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
  @UseInterceptors(FileInterceptor('cover_file'))
  @Put(':id')
  async update(
    @Request() req: ValidatedJWTReq,
    @Param() findAlbumDTO: FindAlbumDTO,
    @Body() albumData: UpdateAlbumDTO,
    @UploadedFile() coverFile: BufferedFile,
  ): Promise<Album> {
    const existingAlbum = await this.albumsService.findOne(findAlbumDTO);

    if (!existingAlbum) {
      throw new BadRequestException('Could not find album');
    }

    if (existingAlbum.user.id !== req.user.id) {
      throw new ForbiddenException();
    }

    const result: UpdateResult = await this.albumsService.update(
      findAlbumDTO,
      albumData,
      existingAlbum,
      coverFile,
    );

    // There is always at least one field updated (UpdatedAt)
    if (!result.affected || result.affected < 1) {
      throw new BadRequestException('Could not update album.');
    }

    // Fetch updated album
    const updatedAlbum = await this.albumsService.findOne(findAlbumDTO);

    if (!updatedAlbum) {
      throw new BadRequestException('Could not find album');
    }

    return updatedAlbum;
  }

  @ApiOperation({ summary: 'Delete album' })
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
    @Param() album: FindAlbumDTO,
  ): Promise<void> {
    const albumToDelete = await this.albumsService.findOne(album);

    if (albumToDelete?.user.id !== req.user.id) {
      throw new ForbiddenException(['You do not own this album.']);
    }

    await this.albumsService.delete(album);
  }
}
