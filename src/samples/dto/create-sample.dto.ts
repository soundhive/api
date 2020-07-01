import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSampleDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  genre: string;
}
