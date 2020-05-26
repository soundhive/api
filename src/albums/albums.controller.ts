import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { Album } from './album.entity';
import { AlbumsService } from './albums.service';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { FindAlbumDTO } from './dto/find-album.dto';
import { UpdateAlbumDTO } from './dto/update-album.dto';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createAlbumDTO: CreateAlbumDTO): Promise<Album> {
    return this.albumsService.create(createAlbumDTO);
  }

  @Get()
  async find(): Promise<Album[]> {
    return this.albumsService.find();
  }

  @Get(':id')
  async findOne(@Param() album: FindAlbumDTO): Promise<Album> {
    return await this.albumsService.findOne(album);
  }

  @Put(':id')
  async update(@Param() album: FindAlbumDTO, @Body() albumData: UpdateAlbumDTO): Promise<Album> {
    await this.albumsService.update(album, albumData);
    return await this.albumsService.findOne(album);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  delete(@Param() album: FindAlbumDTO): void {
    this.albumsService.delete(album).then();
  }
}
