import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateTrackDTO {
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
  filename: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  license: string;

  @IsOptional()
  @IsBoolean()
  downloadable: boolean;
}
