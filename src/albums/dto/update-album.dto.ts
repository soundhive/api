import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateAlbumDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  genre: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  coverFilename: string;
}
