import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { IsUnique } from 'src/validators/unique.validation';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

export class InsertUpdatedUserDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty()
  username: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  @IsUnique(User)
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  profilePicture: string;
}
