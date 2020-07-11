import { IsNotEmpty, IsString, IsUUID, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  genre: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  license: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['true', 'false'])
  @ApiProperty()
  downloadable: string;

  @IsNotEmpty()
  @IsUUID('all')
  @ApiProperty({ description: 'album id' })
  album: string;
}
