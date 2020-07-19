import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AddTrackToPlaylistDTO {
  @IsUUID('all')
  @ApiProperty()
  track_id: string;
}
