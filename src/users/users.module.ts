import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TracksModule } from 'src/tracks/tracks.module';
import { ListeningsModule } from 'src/listenings/listenings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => TracksModule),
    forwardRef(() => ListeningsModule)
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule { }
