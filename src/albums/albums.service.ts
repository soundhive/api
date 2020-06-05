import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { MinioClientService } from 'src/minio-client/minio-client.service';
import { BufferedFile } from 'src/minio-client/file.model';
import { Album } from './album.entity';
import { FindAlbumDTO } from './dto/find-album.dto';
import { InsertAlbumDTO } from './dto/insert-album-dto';
import { UpdateAlbumDTO } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    private minioClientService: MinioClientService,
  ) { }

  async create(insertAlbumDTO: InsertAlbumDTO): Promise<Album> {
    return this.albumsRepository.save(insertAlbumDTO);
  }

  async find(): Promise<Album[]> {
    return this.albumsRepository.find();
  }

  async findOne(album: FindAlbumDTO): Promise<Album | undefined> {
    return this.albumsRepository.findOne({ id: album.id });
  }

  async findBy(params: {}): Promise<Album[]> {
    return this.albumsRepository.find(params);
  }

  async update(album: FindAlbumDTO, albumData: UpdateAlbumDTO): Promise<UpdateResult> {
    return this.albumsRepository.update({ id: album.id }, albumData);
  }

  async delete(album: FindAlbumDTO): Promise<DeleteResult> {
    return this.albumsRepository.delete(album);
  }

  async uploadFileCover(image: BufferedFile): Promise<string> {

    const uploadedImage = await this.minioClientService.upload(image)

    return uploadedImage.url
  }
}
