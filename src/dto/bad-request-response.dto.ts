import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponse {
  @ApiProperty()
  statusCode: string;

  @ApiProperty({ type: [String] })
  message: string | string[];

  @ApiProperty()
  error: string;
}
