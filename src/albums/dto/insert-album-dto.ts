import { User } from 'src/users/user.entity';

export class InsertAlbumDTO {
  title: string;

  description?: string;

  coverFilename: string;

  user: User;
}
