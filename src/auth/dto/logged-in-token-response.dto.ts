import { ApiProperty } from '@nestjs/swagger';

export class LoggedInTokenResponse {
  @ApiProperty()
  token: string;
}
