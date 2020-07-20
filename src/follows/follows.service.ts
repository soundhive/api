import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Follow } from 'src/follows/follow.entity';
import { User } from 'src/users/user.entity';
import {
  DeleteResult,
  FindConditions,
  FindManyOptions,
  Repository,
} from 'typeorm';
import { CreateFollowDTO } from './dto/create-follow-dto';
import { DeleteFollowDTO } from './dto/delete-follow.dto';
import { FindFollowDTO } from './dto/find-follow-dto';
import { FindFollowsUserDTO } from './dto/find-follows.user.dto';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
  ) {}

  async create(createFollowDTO: CreateFollowDTO): Promise<Follow> {
    const existingFollow = await this.followRepository.findOne({
      from: createFollowDTO.from,
      to: createFollowDTO.to,
    });
    if (!existingFollow) {
      if (createFollowDTO.from.id === createFollowDTO.to.id) {
        throw new BadRequestException('You cannot follow yourself');
      }
      return this.followRepository.save(createFollowDTO);
    }

    return existingFollow;
  }

  async delete(deleteFollowDTO: DeleteFollowDTO): Promise<DeleteResult> {
    return this.followRepository.delete(deleteFollowDTO);
  }

  async paginate(
    options: IPaginationOptions,
    searchOptions?: FindConditions<Follow> | FindManyOptions<Follow>,
  ): Promise<Pagination<Follow>> {
    return paginate<Follow>(this.followRepository, options, searchOptions);
  }

  async findUserFollowed(
    findFollowsUserDTO: FindFollowsUserDTO,
  ): Promise<User[]> {
    const followings: Follow[] = await this.followRepository.find({
      from: findFollowsUserDTO,
    });

    return followings.map((e) => e.to);
  }

  async findUserFollowers(
    findFollowsUserDTO: FindFollowsUserDTO,
  ): Promise<User[]> {
    const followings: Follow[] = await this.followRepository.find({
      to: findFollowsUserDTO,
    });

    return followings.map((e) => e.from);
  }

  async findBy(params: {}): Promise<Follow[]> {
    return this.followRepository.find(params);
  }

  async findOne(follow: FindFollowDTO): Promise<Follow | undefined> {
    return this.followRepository.findOne(follow);
  }

  async countFollowers(user: User): Promise<number> {
    return this.followRepository.count({ to: user });
  }

  async countFollowings(user: User): Promise<number> {
    return this.followRepository.count({ from: user });
  }
}
