import { ApiProperty } from '@nestjs/swagger';

export class Keyframe {
  @ApiProperty()
  count: number;

  @ApiProperty()
  period: Date;
}
