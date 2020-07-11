import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TracksService } from 'src/tracks/tracks.service';
import { Track } from 'src/tracks/track.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/minio-client/file.model';
import { ValidatedJWTReq } from 'src/auth/dto/validated-jwt-req';
import { UpdateResult } from 'typeorm';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { BadRequestResponse } from 'src/dto/bad-request-response.dto';
import { UnauthorizedResponse } from 'src/auth/dto/unothorized-response.dto';
import { Album } from './album.entity';
import { AlbumsService } from './albums.service';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { FindAlbumDTO } from './dto/find-album.dto';
import { UpdateAlbumDTO } from './dto/update-album.dto';
import { CreateAlbumAPIBody } from './dto/create-album-api-body.dto';
import { UpdateAlbumAPIBody } from './dto/update-album-api-body.dto';

@Controller('albums')
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
  ) {}

  @ApiOperation({ summary: 'Post a album' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateAlbumAPIBody })
  @ApiCreatedResponse({ type: Album, description: 'Album object' })
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
  @UseInterceptors(FileInterceptor('coverFile'))
  @Post()
  async create(
    @Request() req: ValidatedJWTReq,
    @Body() createAlbumDTO: CreateAlbumDTO,
    @UploadedFile() file: BufferedFile,
  ): Promise<Album> {
    if (!file) {
      throw new BadRequestException('Missing coverFile');
    }

    const albumCover: string = await this.albumsService.uploadFileCover(file);

    const album = await this.albumsService.create({
      ...createAlbumDTO,
      user: req.user,
      coverFilename: albumCover,
    });

    return new Album(album);
  }

  @ApiOperation({ summary: 'Get all albums' })
  @ApiCreatedResponse({ type: [Album], description: 'Album objects' })
  @Get()
  async find(): Promise<Album[]> {
    return this.albumsService.find();
  }

  @ApiOperation({ summary: 'Get a track' })
  @ApiOkResponse({ type: Track, description: 'Track object' })
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
  @ApiOkResponse({ type: [Track], description: 'Track objects' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @Get(':id/tracks')
  async findTracks(@Param() findAlbumDTO: FindAlbumDTO): Promise<Track[]> {
    const album: Album | undefined = await this.albumsService.findOne(
      findAlbumDTO,
    );

    if (!album) {
      throw NotFoundException;
    }

    return this.tracksService.findBy({ album });
  }

  @ApiOperation({ summary: 'Update an album' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateAlbumAPIBody })
  @ApiOkResponse({ type: Album, description: 'Album object' })
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
  @UseInterceptors(FileInterceptor('coverFile'))
  @Put(':id')
  async update(
    @Request() req: ValidatedJWTReq,
    @Param() findAlbumDTO: FindAlbumDTO,
    @Body() albumData: UpdateAlbumDTO,
    @UploadedFile() file: BufferedFile,
  ): Promise<Album> {
    const existingAlbum = await this.albumsService.findOne(findAlbumDTO);

    if (!existingAlbum) {
      throw new BadRequestException('Could not find album');
    }

    if (existingAlbum.user.id !== req.user.id) {
      throw new ForbiddenException();
    }

    let coverFilename: string;
    if (file) {
      coverFilename = await this.albumsService.uploadFileCover(file);
    } else {
      coverFilename = existingAlbum.coverFilename;
    }

    const result: UpdateResult = await this.albumsService.update(findAlbumDTO, {
      ...albumData,
      coverFilename,
    });

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
