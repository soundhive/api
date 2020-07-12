import { Pagination } from 'src/shared/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Sample } from '../samples.entity';

export class SamplePagination extends Pagination {
  @ApiProperty({ type: [Sample] })
  items: Sample[];
}
