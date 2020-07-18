import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import {
  DeleteResult,
  FindConditions,
  FindManyOptions,
  Repository,
} from 'typeorm';
import { CreateFavoriteDTO } from './dto/create-favorite.dto';
import { DeleteFavoriteDTO } from './dto/delete-favorite.dto';
import { FindFavoriteDTO } from './dto/find-favorite.dto';
import { Favorite } from './favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) {}

  async paginate(
    options: IPaginationOptions,
    searchOptions?: FindConditions<Favorite> | FindManyOptions<Favorite>,
  ): Promise<Pagination<Favorite>> {
    return paginate<Favorite>(this.favoriteRepository, options, searchOptions);
  }

  async create(createFavoriteDTO: CreateFavoriteDTO): Promise<Favorite> {
    const existingFav = await this.findOne(createFavoriteDTO);

    if (existingFav) {
      throw new BadRequestException('You already favorited this track');
    }

    return this.favoriteRepository.save(createFavoriteDTO);
  }

  async findBy(params: {}): Promise<Favorite[]> {
    return this.favoriteRepository.find(params);
  }

  async findOne(favorite: FindFavoriteDTO): Promise<Favorite | undefined> {
    return this.favoriteRepository.findOne(favorite);
  }

  async delete(fav: DeleteFavoriteDTO): Promise<DeleteResult> {
    return this.favoriteRepository.delete(fav);
  }
}
