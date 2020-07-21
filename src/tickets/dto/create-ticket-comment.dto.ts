import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTicketCommentDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  message: string;
}
