import { User } from 'src/users/user.entity';

export class InsertPlaylistDTO {
  title: string;

  description?: string;

  user: User;
}
