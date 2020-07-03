import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportsModule } from 'src/supports/supports.module';
import { UsersModule } from 'src/users/users.module';
import { ListeningsModule } from 'src/listenings/listenings.module';
import { AlbumsModule } from 'src/albums/albums.module';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { SamplesService } from './samples.service';
import { Sample } from './samples.entity';
import { SamplesController } from './samples.controller';

@Module({
  imports: [
      TypeOrmModule.forFeature([Sample]),
      forwardRef(() => UsersModule),
      forwardRef(() => ListeningsModule),
      forwardRef(() => AlbumsModule),
      MinioClientModule,
      forwardRef(() => SupportsModule)
  ],
  controllers: [SamplesController],
  providers: [SamplesService],
  exports: [SamplesService],
})
export class SamplesModule { }
