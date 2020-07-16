import { User } from 'src/users/user.entity';

export class InsertSampleDTO {
  title: string;

  description: string;

  user: User;

  visibility: string;

  license: string;
}
