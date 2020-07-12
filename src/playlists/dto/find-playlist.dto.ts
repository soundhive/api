import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exists } from '../../shared/validators/exists.validation';
import { Playlist } from '../playlists.entity';

export class FindPlaylistDTO {
  @IsUUID('all')
  @Exists(Playlist)
  @ApiProperty()
  id: string;
}
