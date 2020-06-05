import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAlbumDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description?: string;
}
