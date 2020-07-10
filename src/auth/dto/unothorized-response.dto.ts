import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedResponse {
  @ApiProperty()
  statusCode: string;

  @ApiProperty()
  message: string;
}
