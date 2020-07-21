import { forwardRef, Module } from '@nestjs/common';
import { AlbumsModule } from 'src/albums/albums.module';
import { FollowsModule } from 'src/follows/follows.module';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { PlaylistsModule } from 'src/playlists/playlists.module';
import { SamplesModule } from 'src/samples/samples.module';
import { TicketsModule } from 'src/tickets/tickets.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { UsersModule } from 'src/users/users.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => TracksModule),
    forwardRef(() => FollowsModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => SamplesModule),
    forwardRef(() => PlaylistsModule),
    forwardRef(() => TicketsModule),
    MinioClientModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
