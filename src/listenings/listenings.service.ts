import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindTrackDTO } from 'src/tracks/dto/find-track.dto';
import { Between, Repository } from 'typeorm';

import { CreateListeningDTO } from './dto/create-listening.dto';
import { FindListeningsDTO } from './dto/find-listenings.dto';
import { Listening } from './listening.entity';

@Injectable()
export class ListeningsService {
  constructor(@InjectRepository(Listening) private listeningRepository: Repository<Listening>) { }

  async create(createListeningDTO: CreateListeningDTO): Promise<Listening> {
    return this.listeningRepository.save(createListeningDTO);
  }

  async find(findTrackDTO: FindTrackDTO, findListeningsDTO: FindListeningsDTO) {

    const getDatesBetween = (startDate: Date, endDate: Date): Date[] => {
      const dates = [];

      const currentDate = new Date(startDate.valueOf())

      while (currentDate <= endDate) {
        dates.push(new Date(currentDate.valueOf()));

        switch (findListeningsDTO.period) {
          case "hour":
            currentDate.setHours(currentDate.getHours() + 1);
            break;
          case "day":
            currentDate.setDate(currentDate.getDate() + 1);
            break;
        }
      }

      return dates;
    };

    const dates = getDatesBetween(new Date(findListeningsDTO.after), new Date(findListeningsDTO.before));

    const stats = []

    for (const date of dates) {
      const startDate = new Date(date.valueOf());

      switch (findListeningsDTO.period) {
        case "hour":
          startDate.setHours(startDate.getHours() - 1);
          break;
        case "day":
          startDate.setDate(startDate.getDate() - 1);
          break;
      }

      const listenings = await this.listeningRepository.find({
        listenedAt: Between(startDate, date),
        track: findTrackDTO,
      });

      stats.push({
        [findListeningsDTO.period]: date,
        count: listenings.length
      });
    }

    return stats;

  }
}
