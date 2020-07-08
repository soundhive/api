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
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TracksService } from 'src/tracks/tracks.service';
import { Track } from 'src/tracks/track.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/minio-client/file.model';
import { ValidatedJWTReq } from 'src/auth/dto/validated-jwt-req';
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

    if (!['image/png', 'image/jpeg'].includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid cover file media type: ${file.mimetype}`,
      );
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
  async update(
    @Param() findAlbumDTO: FindAlbumDTO,
    @Body() albumData: UpdateAlbumDTO,
  ): Promise<Album> {
    await this.albumsService.update(findAlbumDTO, albumData);

    // if (!result.affected || result.affected === 0) {
    //   // return 304?
    // }

    const album: Album | undefined = await this.albumsService.findOne(
      findAlbumDTO,
    );

    if (!album) {
      throw new BadRequestException();
    }

    return album;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async delete(@Param() album: FindAlbumDTO): Promise<void> {
    await this.albumsService.delete(album);
  }
}
