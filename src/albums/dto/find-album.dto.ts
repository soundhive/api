import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exists } from '../../shared/validators/exists.validation';
import { Album } from '../album.entity';

export class FindAlbumDTO {
  @IsUUID('all')
  @Exists(Album)
  @ApiProperty()
  id: string;
}
