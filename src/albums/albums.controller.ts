import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { Album } from './album.entity';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { FindAlbumDTO } from './dto/find-album.dto';
import { UpdateAlbumDTO } from './dto/update-album.dto';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  create(@Body() createAlbumDTO: CreateAlbumDTO) {
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
  @HttpCode(204)
  delete(@Param() album: FindAlbumDTO) {
    this.albumsService.delete(album).then();
  }
}
