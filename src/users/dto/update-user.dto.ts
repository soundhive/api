import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { IsUnique } from 'src/validators/unique.validation';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../user.entity';

export class UpdateUserDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  name?: string;

  @IsOptional()
  @ApiPropertyOptional()
  username?: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  @IsUnique(User)
  @ApiPropertyOptional()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  password?: string;
}
