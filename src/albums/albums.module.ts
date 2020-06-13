import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { Album } from './album.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Album]),
    forwardRef(() => UsersModule),
    forwardRef(() => TracksModule),
    MinioClientModule,
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService]
})
export class AlbumsModule {}
