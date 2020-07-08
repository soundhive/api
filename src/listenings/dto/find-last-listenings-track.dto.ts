import {
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsUUID,
} from 'class-validator';
import { Track } from 'src/tracks/track.entity';
import { Exists } from 'src/validators/exists.validation';

export class FindLastListeningsForTrackDTO {
  @IsUUID('all')
  @Exists(Track)
  id: string;

  @IsNotEmpty()
  @IsNumberString()
  count: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['hour', 'day', 'week', 'month', 'year'])
  period: string;
}
