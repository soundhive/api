import { Module } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './album.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album])],
  controllers: [AlbumsController],
  providers: [AlbumsService]
})
export class AlbumsModule {}
