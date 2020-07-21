import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Exists } from '../../shared/validators/exists.validation';
import { Ticket } from '../ticket.entity';

export class FindTicketDTO {
  @ApiProperty()
  @IsString()
  @Exists(Ticket)
  id: string;
}
export default FindTicketDTO;
