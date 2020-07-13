import { Pagination } from 'src/shared/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Playlist } from '../playlists.entity';

export class PlaylistPagination extends Pagination {
  @ApiProperty({ type: [Playlist] })
  items: Playlist[];
}
