import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { MinioClientService } from 'src/minio-client/minio-client.service';
import { BufferedFile } from 'src/minio-client/file.model';
import { AudioFileMediaType } from 'src/media-types';
import { FindTrackDTO } from './dto/find-track.dto';
import { InsertTrackDTO } from './dto/insert-track.dto';
import { Track } from './track.entity';
import { InsertUpdatedTrackDTO } from './dto/insert-updated-track.dto';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track) private tracksRepository: Repository<Track>,
    private minioClientService: MinioClientService,
  ) {}

  async create(
    insertTrackDTO: InsertTrackDTO,
    trackFile: BufferedFile,
  ): Promise<Track> {
    const track = new Track(insertTrackDTO);
    track.filename = await this.uploadTrackFile(trackFile);

    return this.tracksRepository.save(track);
  }

  async find(): Promise<Track[]> {
    return this.tracksRepository.find();
  }

  async findBy(params: {}): Promise<Track[]> {
    return this.tracksRepository.find(params);
  }

  async findOne(track: FindTrackDTO): Promise<Track | undefined> {
    return this.tracksRepository.findOne({ id: track.id });
  }

  async update(
    track: FindTrackDTO,
    trackData: InsertUpdatedTrackDTO,
    existingTrack: Track,
    trackFile?: BufferedFile,
  ): Promise<UpdateResult> {
    if (trackFile) {
      // Uplodad new track
      const filename = await this.uploadTrackFile(trackFile);
      // Delete old track file
      this.minioClientService.delete(existingTrack.filename);

      return this.tracksRepository.update(
        { id: track.id },
        { ...trackData, filename },
      );
    }

    return this.tracksRepository.update({ id: track.id }, trackData);
  }

  async delete(trackDTO: FindTrackDTO): Promise<DeleteResult> {
    const track = await this.tracksRepository.findOne(trackDTO);

    if (!track) {
      throw new BadRequestException();
    }

    this.minioClientService.delete(track.filename);
    return this.tracksRepository.delete(track.id);
  }

  async uploadTrackFile(file: BufferedFile): Promise<string> {
    if (!Object.values(AudioFileMediaType).includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid track file media type: ${file.mimetype}`,
      );
    }

    const subFolder = 'tracks';

    const uploadedTrackFile = await this.minioClientService.upload(
      file,
      subFolder,
    );

    return uploadedTrackFile.path;
  }
}
