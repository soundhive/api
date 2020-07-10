import {
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsUUID,
} from 'class-validator';
import { Track } from 'src/tracks/track.entity';
import { Exists } from 'src/validators/exists.validation';
import { ApiProperty } from '@nestjs/swagger';
import { ListeningPeriod } from '../listening.entity';

export class FindLastListeningsForTrackDTO {
  @IsUUID('all')
  @Exists(Track)
  @ApiProperty()
  id: string;

  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty()
  count: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['hour', 'day', 'week', 'month', 'year'])
  @ApiProperty({ enum: ListeningPeriod })
  period: ListeningPeriod;
}
