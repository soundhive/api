import { IsEmail, IsNotEmpty, IsString, IsAlphanumeric } from 'class-validator';
import { IsUnique } from 'src/shared/validators/unique.validation';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @IsUnique(User)
  @ApiProperty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @IsUnique(User)
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
