import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListeningsModule } from 'src/listenings/listenings.module';
import { UsersModule } from 'src/users/users.module';

import { Track } from './track.entity';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { Album } from '../albums/album.entity';
import { AlbumsService } from '../albums/albums.service';

@Module({
  imports: [TypeOrmModule.forFeature([Track, Album]), forwardRef(() => UsersModule), ListeningsModule],
  controllers: [TracksController],
  providers: [TracksService, AlbumsService],
  exports: [TracksService]
})
export class TracksModule {}
