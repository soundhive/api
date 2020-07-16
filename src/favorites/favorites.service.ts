import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Favorite } from './favorite.entity';
import { CreateFavoriteDTO } from './dto/create-favorite.dto';
import { DeleteFavoriteDTO } from './dto/delete-favorite.dto';
import { FindFavoriteDTO } from './dto/find-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) {}

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
