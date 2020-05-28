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
} from '@nestjs/common';
import { AuthenticatedUserDTO } from 'src/auth/dto/authenticated-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';

import { Album } from './album.entity';
import { AlbumsService } from './albums.service';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { FindAlbumDTO } from './dto/find-album.dto';
import { UpdateAlbumDTO } from './dto/update-album.dto';
import { UpdateResult } from 'typeorm';

@Controller('albums')
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly usersService: UsersService
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req: { user: AuthenticatedUserDTO }, @Body() createAlbumDTO: CreateAlbumDTO): Promise<Album> {
    const user = await this.usersService.findOne(req.user);

    if (!user) {
      throw new UnauthorizedException();
    }

    return new Album(await this.albumsService.create({ ...createAlbumDTO, user: user }));
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
