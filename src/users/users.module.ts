import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TracksModule } from 'src/tracks/tracks.module';
import { ListeningsModule } from 'src/listenings/listenings.module';
import { SupportsModule } from 'src/supports/supports.module';
import { AlbumsModule } from 'src/albums/albums.module';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => TracksModule),
        forwardRef(() => ListeningsModule),
        forwardRef(() => SupportsModule),
        forwardRef(() => AlbumsModule),
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
