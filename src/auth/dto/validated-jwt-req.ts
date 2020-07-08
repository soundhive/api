import { User } from 'src/users/user.entity';

export interface ValidatedJWTReq {
  user: User;
}
