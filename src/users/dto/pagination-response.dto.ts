import { ApiProperty } from '@nestjs/swagger';
import { Pagination } from 'src/shared/dto/pagination.dto';
import { User } from '../user.entity';

export class UserPagination extends Pagination {
  @ApiProperty({ type: [User] })
  items: User[];
}
