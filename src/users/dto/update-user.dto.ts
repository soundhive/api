import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { IsUnique } from 'src/validators/unique.validation';
import { User } from '../user.entity';

export class UpdateUserDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  username: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  @IsUnique(User)
  email: string;

  @IsOptional()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  profilePicture: string;
}
