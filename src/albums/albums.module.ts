import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { ListeningsModule } from 'src/listenings/listenings.module';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { UsersModule } from 'src/users/users.module';
import { Album } from './album.entity';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Album]),
    forwardRef(() => UsersModule),
    forwardRef(() => TracksModule),
    forwardRef(() => ListeningsModule),
    FavoritesModule,
    MinioClientModule,
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
