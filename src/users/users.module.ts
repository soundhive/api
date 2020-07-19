import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumsModule } from 'src/albums/albums.module';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { FollowsModule } from 'src/follows/follows.module';
import { ListeningsModule } from 'src/listenings/listenings.module';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { PlaylistsModule } from 'src/playlists/playlists.module';
import { SamplesModule } from 'src/samples/samples.module';
import { TracksModule } from 'src/tracks/tracks.module';
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
    forwardRef(() => PlaylistsModule),
    MinioClientModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
