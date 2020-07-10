import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { MinioClientService } from 'src/minio-client/minio-client.service';
import { BufferedFile } from 'src/minio-client/file.model';
import { Album } from './album.entity';
import { FindAlbumDTO } from './dto/find-album.dto';
import { InsertAlbumDTO } from './dto/insert-album-dto';
import { InsertUpdatedAlbumDTO } from './dto/insert-updated-album.dto';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    private minioClientService: MinioClientService,
  ) {}

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

  async update(
    album: FindAlbumDTO,
    albumData: InsertUpdatedAlbumDTO,
  ): Promise<UpdateResult> {
    return this.albumsRepository.update({ id: album.id }, albumData);
  }

  async delete(albumDTO: FindAlbumDTO): Promise<DeleteResult> {
    const album = await this.albumsRepository.findOne(albumDTO);

    if (!album) {
      throw new BadRequestException();
    }

    this.minioClientService.delete(album.coverFilename);
    return this.albumsRepository.delete(album.id);
  }

  async uploadFileCover(
    file: BufferedFile,
    subFolder: string,
  ): Promise<string> {
    if (!['image/png', 'image/jpeg'].includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid cover file media type: ${file.mimetype}`,
      );
    }

    const uploadedImage = await this.minioClientService.upload(file, subFolder);

    return uploadedImage.path;
  }
}
