import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { Track } from 'src/tracks/track.entity';
import { Exists } from 'src/validators/exists.validation';

export class FindListeningsForTrackDTO {
  @IsUUID('all')
  @Exists(Track)
  id: string;

  @IsDateString()
  after: Date;

  @IsDateString()
  before: Date;

  @IsNotEmpty()
  @IsString()
  @IsIn(['hour', 'day', 'week', 'month', 'year'])
  period: string;
}
