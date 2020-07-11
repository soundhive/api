import { User } from 'src/users/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { Exists } from 'src/shared/validators/exists.validation';

export class FindFollowsUserDTO {
  @IsNotEmpty()
  @IsString()
  @Exists(User)
  username: string;
}
