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
import { Album } from './album.entity';
import { AlbumsService } from './albums.service';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { FindAlbumDTO } from './dto/find-album.dto';
import { UpdateAlbumDTO } from './dto/update-album.dto';

@Controller('albums')
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('coverFile'))
  async create(
    @Request() req: ValidatedJWTReq,
    @Body() createAlbumDTO: CreateAlbumDTO,
    @UploadedFile() file: BufferedFile,
  ): Promise<Album> {
    if (!file) {
      throw new BadRequestException('Missing coverFile');
    }

    const albumCover: string = await this.albumsService.uploadFileCover(
      file,
      'albums',
    );

    const album = await this.albumsService.create({
      ...createAlbumDTO,
      user: req.user,
      coverFilename: albumCover,
    });

    return new Album(album);
  }

  @Get()
  async find(): Promise<Album[]> {
    return this.albumsService.find();
  }

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

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('coverFile'))
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
      coverFilename = await this.albumsService.uploadFileCover(file, 'albums');
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

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async delete(@Param() album: FindAlbumDTO): Promise<void> {
    await this.albumsService.delete(album);
  }
}
