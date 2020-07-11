import {
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsUUID,
} from 'class-validator';
import { Exists } from 'src/validators/exists.validation';
import { Sample } from 'src/samples/samples.entity';
import { ListeningPeriod } from '../listening.entity';

export class FindLastListeningsForSampleDTO {
  @IsUUID('all')
  @Exists(Sample)
  id: string;

  @IsNotEmpty()
  @IsNumberString()
  count: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['hour', 'day', 'week', 'month', 'year'])
  period: ListeningPeriod;
}
