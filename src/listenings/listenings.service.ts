/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from 'src/tracks/track.entity';
import { TracksService } from 'src/tracks/tracks.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Between, Repository } from 'typeorm';

import { CreateListeningDTO } from './dto/create-listening.dto';
import { FindLastListeningsForTrackDTO } from './dto/find-last-listenings-track.dto';
import { FindLastListeningsForUserDTO } from './dto/find-last-listenings-user.dto';
import { FindListeningsForTrackDTO } from './dto/find-listenings-track.dto';
import { FindListeningsForUserDTO } from './dto/find-listenings-user.dto';
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
    ) {}

    async create(createListeningDTO: CreateListeningDTO): Promise<Listening> {
        return this.listeningRepository.save(createListeningDTO);
    }

    async findForTrack(
        findListeningsForTrackDTO: FindListeningsForTrackDTO,
    ): Promise<TrackListeningsResponseDTO> {
        const getDatesBetween = (startDate: Date, endDate: Date): Date[] => {
            const dates: Date[] = [];
            const currentDate = new Date(startDate.valueOf());

            while (currentDate <= endDate) {
                dates.push(new Date(currentDate.valueOf()));

                switch (findListeningsForTrackDTO.period) {
                    case 'hour':
                        currentDate.setHours(currentDate.getHours() + 1);
                        break;
                    case 'day':
                        currentDate.setDate(currentDate.getDate() + 1);
                        break;
                    case 'week':
                        currentDate.setDate(currentDate.getDate() + 7);
                        break;
                    case 'month':
                        currentDate.setMonth(currentDate.getMonth() + 1);
                        break;
                    case 'year':
                        currentDate.setFullYear(currentDate.getFullYear() + 1);
                        break;
                    default:
                        break;
                }
            }

            return dates;
        };

        const dates: Date[] = getDatesBetween(
            new Date(findListeningsForTrackDTO.after),
            new Date(findListeningsForTrackDTO.before),
        );

        const stats: {
            count: number;
            period: Date;
        }[] = [];

        let listeningsCount = 0;

        for (const date of dates) {
            const startDate: Date = new Date(date.valueOf());

            switch (findListeningsForTrackDTO.period) {
                case 'hour':
                    startDate.setHours(startDate.getHours() - 1);
                    break;
                case 'day':
                    startDate.setDate(startDate.getDate() - 1);
                    break;
                case 'week':
                    startDate.setDate(startDate.getDate() - 7);
                    break;
                case 'month':
                    startDate.setMonth(startDate.getMonth() - 1);
                    break;
                case 'year':
                    startDate.setFullYear(startDate.getFullYear() - 1);
                    break;
                default:
                    break;
            }

            const listenings: Listening[] = await this.listeningRepository.find(
                {
                    listenedAt: Between(startDate, date),
                    track: findListeningsForTrackDTO,
                },
            );

            stats.push({
                period: startDate,
                count: listenings.length,
            });

            listeningsCount += listenings.length;
        }

        return { listenings: listeningsCount, keyframes: stats };
    }

    async findLastForTrack(
        findLastListeningsForTrackDTO: FindLastListeningsForTrackDTO,
    ): Promise<TrackListeningsResponseDTO> {
        const after: Date = new Date();

        for (let i = 0; i < findLastListeningsForTrackDTO.count - 1; i += 1) {
            switch (findLastListeningsForTrackDTO.period) {
                case 'hour':
                    after.setHours(after.getHours() - 1);
                    break;
                case 'day':
                    after.setDate(after.getDate() - 1);
                    break;
                case 'week':
                    after.setDate(after.getDate() - 7);
                    break;
                case 'month':
                    after.setMonth(after.getMonth() - 1);
                    break;
                case 'year':
                    after.setFullYear(after.getFullYear() - 1);
                    break;
                default:
                    break;
            }
        }

        return this.findForTrack({
            ...findLastListeningsForTrackDTO,
            after,
            before: new Date(),
        });
    }

    async findForUser(
        findListeningsForUserDTO: FindListeningsForUserDTO,
    ): Promise<UserListeningsResponseDTO> {
        const user: User | undefined = await this.usersService.findOne(
            findListeningsForUserDTO,
        );
        if (!user) {
            throw BadRequestException;
        }
        const tracks: Track[] = await this.tracksService.findBy({ user });

        const stats: UserListeningsResponseDTO[] = [];
        for (const track of tracks) {
            stats.push(
                await this.findForTrack({
                    id: track.id,
                    period: findListeningsForUserDTO.period,
                    after: findListeningsForUserDTO.after,
                    before: findListeningsForUserDTO.before,
                }),
            );
        }

        const keyframesBuilder: { count: number; period: Date }[][] = [];
        for (const stat of stats) {
            keyframesBuilder.push(stat.keyframes);
        }

        // @ts-ignore
        const keyframes: { count: number; period: Date }[] = Object.values(
            ([] as { count: number; period: Date }[][])
                .concat(...keyframesBuilder)
                .reduce(
                    (
                        // eslint-disable-next-line no-shadow
                        keyframes: { count: number; period: Date }[],
                        // @ts-ignore
                        { period, count },
                    ) => {
                        // eslint-disable-next-line no-param-reassign
                        keyframes[period] = {
                            period,
                            count:
                                (keyframes[period]
                                    ? keyframes[period].count
                                    : 0) + count,
                        };
                        return keyframes;
                    },
                    // @ts-ignore
                    {},
                ),
        );

        const listeningStats: { listenings: number }[] = stats;
        const count: { listenings: number } = listeningStats.reduce(
            (total, trackCount) => ({
                listenings: total.listenings + trackCount.listenings,
            }),
            { listenings: 0 },
        );

        return { ...count, keyframes };
    }

    async findLastForUser(
        findLastListeningsForUserDTO: FindLastListeningsForUserDTO,
    ): Promise<UserListeningsResponseDTO> {
        const after: Date = new Date();

        for (let i = 0; i < findLastListeningsForUserDTO.count - 1; i += 1) {
            switch (findLastListeningsForUserDTO.period) {
                case 'hour':
                    after.setHours(after.getHours() - 1);
                    break;
                case 'day':
                    after.setDate(after.getDate() - 1);
                    break;
                case 'week':
                    after.setDate(after.getDate() - 7);
                    break;
                case 'month':
                    after.setMonth(after.getMonth() - 1);
                    break;
                case 'year':
                    after.setFullYear(after.getFullYear() - 1);
                    break;
                default:
                    break;
            }
        }

        return this.findForUser({
            ...findLastListeningsForUserDTO,
            after,
            before: new Date(),
        });
    }
}
