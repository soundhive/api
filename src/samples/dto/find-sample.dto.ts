import { IsUUID } from 'class-validator';
import { Exists } from '../../validators/exists.validation';
import { Sample } from '../samples.entity';

export class FindSampleDTO {
  @IsUUID('all')
  @Exists(Sample)
  id: string;
}
