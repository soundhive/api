import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TracksModule } from 'src/tracks/tracks.module';
import { UsersModule } from 'src/users/users.module';
import { Favorite } from './favorite.entity';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite]),
    forwardRef(() => TracksModule),
    forwardRef(() => UsersModule),
  ],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
