import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { ListeningsModule } from 'src/listenings/listenings.module';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { UsersModule } from 'src/users/users.module';
import { PlaylistsController } from './playlists.controller';
import { Playlist } from './playlists.entity';
import { PlaylistsService } from './playlists.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Playlist]),
    forwardRef(() => UsersModule),
    forwardRef(() => ListeningsModule),
    forwardRef(() => TracksModule),
    forwardRef(() => FavoritesModule),
    MinioClientModule,
  ],
  controllers: [PlaylistsController],
  providers: [PlaylistsService],
  exports: [PlaylistsService],
})
export class PlaylistsModule {}
