/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';

class IPaginationMeta {
  /**
   * the amount of items on this specific page
   */
  @ApiProperty()
  itemCount: number;

  /**
   * the total amount of items
   */
  @ApiProperty()
  totalItems: number;

  /**
   * the amount of items that were requested per page
   */
  @ApiProperty()
  itemsPerPage: number;

  /**
   * the total amount of pages in this paginator
   */
  @ApiProperty()
  totalPages: number;

  /**
   * the current page this paginator "points" to
   */
  @ApiProperty()
  currentPage: number;
}
class IPaginationLinks {
  /**
   * a link to the "first" page
   */
  @ApiProperty()
  first?: string;

  /**
   * a link to the "previous" page
   */
  @ApiProperty()
  previous?: string;

  /**
   * a link to the "next" page
   */
  @ApiProperty()
  next?: string;

  /**
   * a link to the "last" page
   */
  @ApiProperty()
  last?: string;
}

export class Pagination {
  /**
   * associated meta information (e.g., counts)
   */
  @ApiProperty()
  meta: IPaginationMeta;

  /**
   * associated links
   */
  @ApiProperty()
  links: IPaginationLinks;
}
