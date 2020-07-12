import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { Playlist } from './playlists.entity';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Playlist]),
    forwardRef(() => UsersModule),
    forwardRef(() => TracksModule),
    MinioClientModule,
  ],
  controllers: [PlaylistsController],
  providers: [PlaylistsService],
  exports: [PlaylistsService],
})
export class PlaylistsModule {}
