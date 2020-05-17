import { Injectable, NotFoundException } from '@nestjs/common';
import { Track } from './track.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateTrackDTO } from './dto/create-track.dto';
import { FindTrackDTO } from './dto/find-track.dto';
import { UpdateTrackDTO } from './dto/update-track.dto';
import { Album } from '../albums/album.entity';
import { AlbumsService } from '../albums/albums.service';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track) private trackRepository: Repository<Track>,
    @InjectRepository(Album) private albumRepository: Repository<Album>,
    private albumsService: AlbumsService,
  ) {}

  async create(createTrackDTO: CreateTrackDTO): Promise<Track> {
    return this.trackRepository.save(createTrackDTO);
  }

  async find(): Promise<Track[]> {
    return await this.trackRepository.find();
  }

  async findBy(params): Promise<Track[]> {
    return await this.trackRepository.find(params);
  }

  async findOne(track: FindTrackDTO): Promise<Track> {
    return await this.trackRepository.findOne({ id: track.id });
  }

  async update(track: FindTrackDTO, trackData: UpdateTrackDTO): Promise<UpdateResult> {
    return await this.trackRepository.update({ id: track.id }, trackData);
  }

  async delete(track: FindTrackDTO): Promise<DeleteResult> {
    return await this.trackRepository.delete({ id: track.id });
  }

  private async findTrackById(id: string): Promise<Album> {
    const found = await this.albumRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Track with id ${id} not found.`);
    }

    return found;
  }
}
