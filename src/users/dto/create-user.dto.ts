import { IsEmail, IsNotEmpty, IsString, IsAlphanumeric } from 'class-validator';
import { Unique } from 'src/unique.validation';
import { User } from '../user.entity';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @Unique(User)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @Unique(User)
  email: string;

  @IsNotEmpty()
  password: string;
}
