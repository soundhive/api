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
  UnauthorizedException,
  UseGuards,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthenticatedUserDTO } from 'src/auth/dto/authenticated-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { FileInterceptor } from '@nestjs/platform-express'
import { UpdateResult } from 'typeorm';
import { TracksService } from 'src/tracks/tracks.service';
import { Track } from 'src/tracks/track.entity';
import { BufferedFile } from 'src/minio-client/file.model';
import { Album } from './album.entity';
import { AlbumsService } from './albums.service';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { FindAlbumDTO } from './dto/find-album.dto';
import { UpdateAlbumDTO } from './dto/update-album.dto';

@Controller('albums')
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly usersService: UsersService,
    private readonly tracksService: TracksService
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(@Request() req: { user: AuthenticatedUserDTO }, @Body() createAlbumDTO: CreateAlbumDTO, @UploadedFile() file: BufferedFile): Promise<Album> {
    const user = await this.usersService.findOne(req.user);

    const albumCover: string = await this.albumsService.uploadFileCover(file)

    if (!user) {
      throw new UnauthorizedException();
    }

    return new Album(await this.albumsService.create({ ...createAlbumDTO, user, coverFilename: albumCover }));
  }

  @Get()
  async find(): Promise<Album[]> {
    return this.albumsService.find();
  }

  @Get(':id')
  async findOne(@Param() findAlbumDTO: FindAlbumDTO): Promise<Album> {
    const album: Album | undefined = await this.albumsService.findOne(findAlbumDTO);

    if (!album) {
      throw NotFoundException;
    }

    return album;
  }


  @Get(':id/tracks')
  async findTracks(@Param() findAlbumDTO: FindAlbumDTO): Promise<Track[]> {
    const album: Album | undefined = await this.albumsService.findOne(findAlbumDTO);

    if (!album) {
      throw NotFoundException;
    }

    return this.tracksService.findBy({ album })
  }

  @Put(':id')
  async update(@Param() findAlbumDTO: FindAlbumDTO, @Body() albumData: UpdateAlbumDTO): Promise<Album> {

    const result: UpdateResult = await this.albumsService.update(findAlbumDTO, albumData);

    if (!result.affected || result.affected === 0) {
      throw BadRequestException;
    }

    const album: Album | undefined = await this.albumsService.findOne(findAlbumDTO);

    if (!album) {
      throw BadRequestException;
    }

    return album;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  delete(@Param() album: FindAlbumDTO): void {
    this.albumsService.delete(album).then();
  }
}
