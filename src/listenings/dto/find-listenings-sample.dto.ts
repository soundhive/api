import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { Exists } from 'src/shared/validators/exists.validation';
import { Sample } from 'src/samples/samples.entity';
import { ListeningPeriod } from '../listening.entity';

export class FindListeningsForSampleDTO {
  @IsUUID('all')
  @Exists(Sample)
  id: string;

  @IsDateString()
  after: Date;

  @IsDateString()
  before: Date;

  @IsNotEmpty()
  @IsString()
  @IsIn(['hour', 'day', 'week', 'month', 'year'])
  period: ListeningPeriod;
}
