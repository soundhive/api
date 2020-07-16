import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TracksModule } from 'src/tracks/tracks.module';
import { SamplesModule } from 'src/samples/samples.module';
import { ListeningsModule } from 'src/listenings/listenings.module';
import { FollowsModule } from 'src/follows/follows.module';
import { AlbumsModule } from 'src/albums/albums.module';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => TracksModule),
    forwardRef(() => ListeningsModule),
    forwardRef(() => FollowsModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => SamplesModule),
    forwardRef(() => FavoritesModule),
    MinioClientModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
