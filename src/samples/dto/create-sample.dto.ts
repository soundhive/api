import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsIn,
  // IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSampleDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsString()
  @IsIn(['public', 'followers'])
  @ApiProperty()
  visibility: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  license: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['true', 'false'])
  @ApiProperty()
  downloadable: string;
}
