import { User } from 'src/users/user.entity';

export class InsertSampleDTO {
  title: string;

  description: string;

  filename: string;

  user: User;

  visibility: string;

  license: string;

  downloadable: boolean;
}
