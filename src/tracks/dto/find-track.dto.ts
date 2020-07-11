import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exists } from '../../validators/exists.validation';
import { Track } from '../track.entity';

export class FindTrackDTO {
  @IsUUID('all')
  @Exists(Track)
  @ApiProperty()
  id: string;
}
