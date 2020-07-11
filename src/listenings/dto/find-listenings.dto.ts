import { IsDateString, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ListeningPeriod } from '../listening.entity';

export class FindListeningsDTO {
  @IsDateString()
  @ApiProperty()
  after: Date;

  @IsDateString()
  @ApiProperty()
  before: Date;

  @IsNotEmpty()
  @IsString()
  @IsIn(['hour', 'day', 'week', 'month', 'year'])
  @ApiProperty({ enum: ListeningPeriod })
  period: ListeningPeriod;
}
