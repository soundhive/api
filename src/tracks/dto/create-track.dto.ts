import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Album } from 'src/albums/album.entity';

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

  @IsNotEmpty()
  @IsUUID("all")
  album: string;
}
