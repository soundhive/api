import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { Album } from './album.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Album]),
    forwardRef(() => UsersModule),
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService]
})
export class AlbumsModule {}
