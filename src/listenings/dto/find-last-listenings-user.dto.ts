import { IsIn, IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { User } from 'src/users/user.entity';
import { Exists } from 'src/validators/exists.validation';
import { ApiProperty } from '@nestjs/swagger';
import { ListeningPeriod } from '../listening.entity';

export class FindLastListeningsForUserDTO {
  @IsNotEmpty()
  @IsString()
  @Exists(User)
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty()
  count: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['hour', 'day', 'week', 'month', 'year'])
  @ApiProperty({ enum: ListeningPeriod })
  period: ListeningPeriod;
}
