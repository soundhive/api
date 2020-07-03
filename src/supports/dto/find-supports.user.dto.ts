import { User } from 'src/users/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { Exists } from 'src/validators/exists.validation';

export class FindSupportsUserDTO {
    @IsNotEmpty()
    @IsString()
    @Exists(User)
    username: string;
}
