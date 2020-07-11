import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exists } from '../../shared/validators/exists.validation';
import { Sample } from '../samples.entity';

export class FindSampleDTO {
  @IsUUID('all')
  @Exists(Sample)
  @ApiProperty()
  id: string;
}
