import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumsModule } from 'src/albums/albums.module';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { ListeningsModule } from 'src/listenings/listenings.module';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { PlaylistsModule } from 'src/playlists/playlists.module';
import { UsersModule } from 'src/users/users.module';
import { Album } from '../albums/album.entity';
import { AlbumsService } from '../albums/albums.service';
import { Track } from './track.entity';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Track, Album]),
    forwardRef(() => UsersModule),
    forwardRef(() => ListeningsModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => FavoritesModule),
    forwardRef(() => PlaylistsModule),
    MinioClientModule,
  ],
  controllers: [TracksController],
  providers: [TracksService, AlbumsService],
  exports: [TracksService],
})
export class TracksModule {}
