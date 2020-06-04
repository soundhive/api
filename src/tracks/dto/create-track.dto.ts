import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

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
  filename: string;

  @IsOptional()
  @IsNotEmpty()
  @IsUUID("all")
  album: string;
}
