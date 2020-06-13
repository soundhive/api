import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

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
  @IsUUID("all")
  album: string;
}
