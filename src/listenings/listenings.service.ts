import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateListeningDTO } from './dto/create-listening.dto';
import { Listening } from './listening.entity';

@Injectable()
export class ListeningsService {
  constructor(@InjectRepository(Listening) private listeningRepository: Repository<Listening>) {}

  async create(createListeningDTO: CreateListeningDTO): Promise<Listening> {
    return this.listeningRepository.save(createListeningDTO);
  }
}
