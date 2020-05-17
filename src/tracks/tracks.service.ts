import { Injectable } from '@nestjs/common';
import { Track } from './track.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateTrackDTO } from './dto/create-track.dto';
import { FindTrackDTO } from './dto/find-track.dto';
import { UpdateTrackDTO } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(@InjectRepository(Track) private trackRepository: Repository<Track>) {}

  async create(createTrackDTO: CreateTrackDTO): Promise<Track> {
    return this.trackRepository.create(createTrackDTO);
  }

  async find(): Promise<Track[]> {
    return await this.trackRepository.find();
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
}
