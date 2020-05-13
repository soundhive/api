import { Injectable } from '@nestjs/common';
import { Track } from './track.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrackDTO } from './dto/create-track.dto';

@Injectable()
export class TracksService {
  constructor(@InjectRepository(Track) private trackRepository: Repository<Track>) {}

  async insertTrack(createTrackDTO: CreateTrackDTO) {
    return await this.trackRepository.save(createTrackDTO);
  }

  async getAllTracks(): Promise<Track[]> {
    return await this.trackRepository.find();
  }

  async getTrack(id: string): Promise<Track> {
    return await this.trackRepository.findOne(id);
  }
}
