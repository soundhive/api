import { IsString } from 'class-validator';
import { Exists } from '../../validators/exists.validation';
import { User } from '../user.entity';

export class FindUserDTO {
    @IsString()
    @Exists(User)
    username: string;
}
export default FindUserDTO;
