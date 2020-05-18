import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindTrackDTO } from 'src/tracks/dto/find-track.dto';
import { Between, Repository } from 'typeorm';

import { CreateListeningDTO } from './dto/create-listening.dto';
import { FindLastListengsForTrackDTO } from './dto/find-last-listenings-track.dto';
import { FindListeningsDTO } from './dto/find-listenings.dto';
import { Listening } from './listening.entity';

@Injectable()
export class ListeningsService {
  constructor(@InjectRepository(Listening) private listeningRepository: Repository<Listening>) { }

  async create(createListeningDTO: CreateListeningDTO): Promise<Listening> {
    return this.listeningRepository.save(createListeningDTO);
  }

  async findLast(findLastListengsForTrackDTO: FindLastListengsForTrackDTO) {
    const findTrackDTO = new FindTrackDTO();
    findTrackDTO.id = findLastListengsForTrackDTO.id;

    const findListeningsDTO = new FindListeningsDTO();
    findListeningsDTO.period = findLastListengsForTrackDTO.period;
    findListeningsDTO.after = new Date()
    findListeningsDTO.before = new Date()
    for (let i = 0; i < findLastListengsForTrackDTO.count - 1; i++) {
      switch (findListeningsDTO.period) {
        case "hour":
          findListeningsDTO.after.setHours(findListeningsDTO.after.getHours() - 1);
          break;
        case "day":
          findListeningsDTO.after.setDate(findListeningsDTO.after.getDate() - 1);
          break;
        case "week":
          findListeningsDTO.after.setDate(findListeningsDTO.after.getDate() - 7);
          break;
        case "month":
          findListeningsDTO.after.setMonth(findListeningsDTO.after.getMonth() - 1);
          break;
        case "year":
          findListeningsDTO.after.setFullYear(findListeningsDTO.after.getFullYear() - 1);
          break;
      }
    }

    return await this.find(findTrackDTO, findListeningsDTO)
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
          case "week":
            currentDate.setDate(currentDate.getDate() + 7);
            break;
          case "month":
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
          case "year":
            currentDate.setFullYear(currentDate.getFullYear() + 1);
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
        case "week":
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case "year":
          startDate.setFullYear(startDate.getFullYear() - 1);
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
