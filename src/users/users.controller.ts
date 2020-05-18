import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FindLastListengsForUserDTO } from 'src/listenings/dto/find-last-listenings-user.dto';
import { ListeningsService } from 'src/listenings/listenings.service';
import { TracksService } from 'src/tracks/tracks.service';

import { CreateUserDTO } from './dto/create-user.dto';
import { FindUserDTO } from './dto/find-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private readonly listeningsService: ListeningsService,
    private readonly tracksService: TracksService,
  ) { }

  @Post()
  async create(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    return await this.usersService.create(new User(createUserDTO));
  }

  @Get()
  async find(): Promise<User[]> {
    return this.usersService.find();
  }

  @Get(':username')
  async findOne(@Param() user: FindUserDTO): Promise<User> {
    return await this.usersService.findOne(user);
  }

  @Get(':username/stats/last/:count/:period')
  async findLastStats(@Param() findLastListengsForUserDTO: FindLastListengsForUserDTO) {
    const user = await this.usersService.findOne(findLastListengsForUserDTO);
    const tracks = await this.tracksService.findBy({ user: user })

    const stats = [];
    for (const track of tracks) {
      stats.push(await this.listeningsService.findLast({
        id: track.id,
        period: findLastListengsForUserDTO.period,
        count: findLastListengsForUserDTO.count,
      }));
    };

    const keyframes = []
    for (const stat of stats) {
      keyframes.push(stat.keyframes);
    }

    function flatten(a) {
      return Array.isArray(a) ? [].concat(...a.map(flatten)) : a;
    }

    const statsPerPeriod = Object.values(flatten(keyframes).reduce((keyframes, { period, count }) => {
      keyframes[period] = { period, count: (keyframes[period] ? keyframes[period].count : 0) + count };
      return keyframes;
    }, {}));


    const count = stats.reduce((total, trackCount) => ({ listenings: total.listenings + trackCount.listenings }));

    return { ...count, keyframes: statsPerPeriod };
  }
}
