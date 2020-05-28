import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { FindTrackDTO } from './dto/find-track.dto';
import { InsertTrackDTO } from './dto/insert-track.dto';
import { UpdateTrackDTO } from './dto/update-track.dto';
import { Track } from './track.entity';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track) private trackRepository: Repository<Track>,
  ) { }

  async create(createTrackDTO: InsertTrackDTO): Promise<Track> {
    return this.trackRepository.save(createTrackDTO);
  }

  async find(): Promise<Track[]> {
    return await this.trackRepository.find();
  }

  async findBy(params: {}): Promise<Track[]> {
    return await this.trackRepository.find(params);
  }

  async findOne(track: FindTrackDTO): Promise<Track | undefined> {
    return await this.trackRepository.findOne({ id: track.id });
  }

  async update(track: FindTrackDTO, trackData: UpdateTrackDTO): Promise<UpdateResult> {
    return await this.trackRepository.update({ id: track.id }, trackData);
  }

  async delete(track: FindTrackDTO): Promise<DeleteResult> {
    return await this.trackRepository.delete({ id: track.id });
  }
}
