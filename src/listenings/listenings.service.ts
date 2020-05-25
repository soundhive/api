import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindTrackDTO } from 'src/tracks/dto/find-track.dto';
import { Track } from 'src/tracks/track.entity';
import { TracksService } from 'src/tracks/tracks.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Between, Repository } from 'typeorm';

import { CreateListeningDTO } from './dto/create-listening.dto';
import { FindLastListeningsForTrackDTO } from './dto/find-last-listenings-track.dto';
import { FindLastListeningsForUserDTO } from './dto/find-last-listenings-user.dto';
import { FindListeningsDTO } from './dto/find-listenings.dto';
import { TrackListeningsResponseDTO } from './dto/responses/track-listenings-response.dto';
import { UserListeningsResponseDTO } from './dto/responses/user-listenings-response.dto';
import { Listening } from './listening.entity';

@Injectable()
export class ListeningsService {
  constructor(
    @InjectRepository(Listening)
    private listeningRepository: Repository<Listening>,
    private readonly usersService: UsersService,
    private readonly tracksService: TracksService,
  ) { }

  async create(createListeningDTO: CreateListeningDTO): Promise<Listening> {
    return this.listeningRepository.save(createListeningDTO);
  }

  async findLast(findLastListeningsForTrackDTO: FindLastListeningsForTrackDTO): Promise<TrackListeningsResponseDTO> {
    const findTrackDTO = new FindTrackDTO();
    findTrackDTO.id = findLastListeningsForTrackDTO.id;

    const findListeningsDTO = new FindListeningsDTO();
    findListeningsDTO.period = findLastListeningsForTrackDTO.period;
    findListeningsDTO.after = new Date()
    findListeningsDTO.before = new Date()
    for (let i = 0; i < findLastListeningsForTrackDTO.count - 1; i++) {
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

  async find(findTrackDTO: FindTrackDTO, findListeningsDTO: FindListeningsDTO): Promise<TrackListeningsResponseDTO> {

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
    let listeningsCount = 0;

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
        period: startDate,
        count: listenings.length
      });

      listeningsCount += listenings.length;
    }

    return { listenings: listeningsCount, keyframes: stats };
  }

  // async findForUser(): Promise<UserListeningsResponseDTO> {

  // }

  async findLastForUser(findLastListeningsForUserDTO: FindLastListeningsForUserDTO): Promise<UserListeningsResponseDTO> {
    const user: User = await this.usersService.findOne(findLastListeningsForUserDTO);
    const tracks: Track[] = await this.tracksService.findBy({ user: user })

    const stats: UserListeningsResponseDTO[] = [];
    for (const track of tracks) {
      stats.push(await this.findLast({
        id: track.id,
        period: findLastListeningsForUserDTO.period,
        count: findLastListeningsForUserDTO.count,
      }));
    };

    const keyframesBuilder: { count: number, period: Date }[][] = [];
    for (const stat of stats) {
      keyframesBuilder.push(stat.keyframes);
    }

    const keyframes: { count: number, period: Date }[] = Object.values([].concat(...keyframesBuilder).reduce((keyframes: { count: number, period: Date }[], { period, count }) => {
      keyframes[period] = { period, count: (keyframes[period] ? keyframes[period].count : 0) + count };
      return keyframes;
    }, {}));

    const listeningStats: { listenings: number }[] = stats;
    const count: { listenings: number } = listeningStats.reduce((total, trackCount) => ({ listenings: total.listenings + trackCount.listenings }));

    return { ...count, keyframes: keyframes };
  }
}
