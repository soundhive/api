import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Album } from './album.entity';
import { CreateAlbumDTO } from './dto/create-album.dto';

@Injectable()
export class AlbumsService {
  constructor(@InjectRepository(Album) private albumsRepository: Repository<Album>) {}

  async insertAlbum(createAlbumDTO: CreateAlbumDTO) {
    return await this.albumsRepository.save(createAlbumDTO);
  }

  async getAlbum(id: string): Promise<Album> {
    return this.findAlbumById(id);
  }
  
  async getAllAlbums(): Promise<Album[]> {
    return await this.albumsRepository.find();
  }

  // async getAlbum(id: string): Promise<Album> {
  //   return await this.albumsRepository.findOne(id);
  // }

  async updateAlbum(id: string, album: Album): Promise<UpdateResult> {
    return await this.albumsRepository.update(id, album);
  }

  async deleteAlbum(id: string): Promise<DeleteResult> {
    return await this.albumsRepository.delete(id);
  }

  private async findAlbumById(id: string): Promise<Album> {
    const found = await this.albumsRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Album with id ${id} not found.`);
    }

    return found;
  }
}
