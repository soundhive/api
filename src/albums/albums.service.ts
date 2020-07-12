import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { MinioClientService } from 'src/minio-client/minio-client.service';
import { BufferedFile } from 'src/minio-client/file.model';
import { ImageFileMediaTypes } from 'src/media-types';
import { TracksService } from 'src/tracks/tracks.service';
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
    private tracksService: TracksService,
  ) {}

  async create(
    insertAlbumDTO: InsertAlbumDTO,
    coverFile: BufferedFile,
  ): Promise<Album> {
    const album = new Album(insertAlbumDTO);
    album.coverFilename = await this.uploadFileCover(coverFile);

    return this.albumsRepository.save(album);
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
    existingAlbum: Album,
    coverFile?: BufferedFile,
  ): Promise<UpdateResult> {
    if (coverFile) {
      // Uplodad new album cover
      const coverFilename = await this.uploadFileCover(coverFile);
      // Delete old album cover file
      this.minioClientService.delete(existingAlbum.coverFilename);

      return this.albumsRepository.update(
        { id: album.id },
        { ...albumData, coverFilename },
      );
    }

    return this.albumsRepository.update({ id: album.id }, albumData);
  }

  async delete(albumDTO: FindAlbumDTO): Promise<DeleteResult> {
    const album = await this.albumsRepository.findOne(albumDTO);

    if (!album) {
      throw new BadRequestException();
    }

    const tracks = await this.tracksService.findBy({ album });

    for (const track of tracks) {
      await this.tracksService.delete({ id: track.id });
    }

    this.minioClientService.delete(album.coverFilename);
    return this.albumsRepository.delete(album.id);
  }

  async uploadFileCover(file: BufferedFile): Promise<string> {
    if (!Object.values(ImageFileMediaTypes).includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid cover_file media type: ${file.mimetype}`,
      );
    }

    const subFolder = 'albums';

    const uploadedImage = await this.minioClientService.upload(file, subFolder);

    return uploadedImage.path;
  }
}
