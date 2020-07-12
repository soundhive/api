import { IsNotEmpty, IsOptional, IsString, IsJSON } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePlaylistDTO {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  title?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  description?: string;

  @IsJSON()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({
    type: [String],
    description: 'JSON array of tracks ids',
  })
  tracks?: string;
}
