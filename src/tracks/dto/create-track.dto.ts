import { IsNotEmpty, IsString, IsUUID, IsIn } from 'class-validator';

export class CreateTrackDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  genre: string;

  @IsNotEmpty()
  @IsString()
  license: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['true', 'false'])
  downloadable: string;

  @IsNotEmpty()
  @IsUUID('all')
  album: string;
}
