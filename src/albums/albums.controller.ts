import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { Album } from './album.entity';
import { CreateAlbumDTO } from './dto/create-album.dto';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  addAlbum(@Body() createAlbumDTO: CreateAlbumDTO) {
    return this.albumsService.insertAlbum(createAlbumDTO);
  }

  @Get()
  getAllAlbums() {
    return this.albumsService.getAllAlbums();
  }

  @Get(':id')
  getAlbum(@Param('id') albumId: string) {
    return this.albumsService.getAlbum(albumId);
  }

  @Put(':id')
  @HttpCode(204)
  updateAlbum(@Param('id') id, @Body() albumData: Album) {
    return this.albumsService.updateAlbum(id, albumData);
  }

  @Delete(':id')
  @HttpCode(200)
  deleteAlbum(@Param('id') albumId: string) {
    this.albumsService.deleteAlbum(albumId).then();

    return null;
  }
}
