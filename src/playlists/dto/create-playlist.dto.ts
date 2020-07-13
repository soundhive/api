import { IsNotEmpty, IsOptional, IsString, IsJSON } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlaylistDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  description?: string;

  @IsJSON()
  @IsNotEmpty()
  @ApiProperty({ type: [String], description: 'JSON array of tracks ids' })
  tracks: string;
}
