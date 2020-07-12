import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumberString } from 'class-validator';

export class PaginationQuery {
  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional()
  page?: number;

  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional()
  limit?: number;
}
