import { User } from 'src/users/user.entity';

export class InsertTicketDTO {
  title: string;

  message: string;

  creator: User;
}
