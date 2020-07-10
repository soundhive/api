import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDTO {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
