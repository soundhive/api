import { Exists } from 'src/validators/exists.validation';
import { User } from 'src/users/user.entity';

export class DeleteFollowDTO {
  // user 2 unsubscribes from user 1:
  @Exists(User)
  to: User;

  @Exists(User)
  from: User;
}
