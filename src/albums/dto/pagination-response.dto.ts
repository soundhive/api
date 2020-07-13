import { Pagination } from 'src/shared/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Album } from '../album.entity';

export class AlbumPagination extends Pagination {
  @ApiProperty({ type: [Album] })
  items: Album[];
}
