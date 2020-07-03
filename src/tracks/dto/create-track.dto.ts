import { IsNotEmpty, IsString, IsUUID, IsBoolean } from 'class-validator';

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
  @IsBoolean()
  downloadable: string;

  @IsNotEmpty()
  @IsUUID("all")
  album: string;
}
