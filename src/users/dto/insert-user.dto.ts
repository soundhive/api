import { IsEmail, IsNotEmpty, IsString, IsAlphanumeric } from 'class-validator';
import { IsUnique } from 'src/validators/unique.validation';
import { User } from '../user.entity';

export class InsertUserDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @IsUnique(User)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @IsUnique(User)
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  profilePicture: string;
}
