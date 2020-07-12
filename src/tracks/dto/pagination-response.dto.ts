import { Pagination } from 'src/shared/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Track } from '../track.entity';

export class TrackPagination extends Pagination {
  @ApiProperty({ type: [Track] })
  items: Track[];
}
