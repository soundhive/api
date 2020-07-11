import { IsNotEmpty, IsString, IsIn } from 'class-validator';
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

  @IsString()
  @IsIn(['public', 'followers'])
  @ApiProperty()
  visibility: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  license: string;

  @IsString()
  @IsIn(['true', 'false'])
  @ApiProperty()
  downloadable: string;
}
