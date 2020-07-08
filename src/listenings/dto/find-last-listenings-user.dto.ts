import { IsIn, IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { User } from 'src/users/user.entity';
import { Exists } from 'src/validators/exists.validation';

export class FindLastListeningsForUserDTO {
  @IsNotEmpty()
  @IsString()
  @Exists(User)
  username: string;

  @IsNotEmpty()
  @IsNumberString()
  count: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['hour', 'day', 'week', 'month', 'year'])
  period: string;
}
