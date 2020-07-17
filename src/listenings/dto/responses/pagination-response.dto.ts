import { Pagination } from 'src/shared/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Listening } from 'src/listenings/listening.entity';

export class ListeningPagination extends Pagination {
  @ApiProperty({ type: [Listening] })
  items: Listening[];
}
