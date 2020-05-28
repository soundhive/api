import { Module, forwardRef } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './album.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Album]),
    forwardRef(() => UsersModule),
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService]
})
export class AlbumsModule {}
