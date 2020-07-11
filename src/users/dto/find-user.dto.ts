import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exists } from '../../shared/validators/exists.validation';
import { User } from '../user.entity';

export class FindUserDTO {
  @ApiProperty()
  @IsString()
  @Exists(User)
  username: string;
}
export default FindUserDTO;
