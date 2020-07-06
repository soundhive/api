import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsIn,
    IsBoolean,
} from 'class-validator';
import { User } from 'src/users/user.entity';
import { Exists } from 'src/validators/exists.validation';

export class InsertSampleDTO {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    filename: string;

    @IsNotEmpty()
    @Exists(User)
    user: User;

    @IsOptional()
    @IsString()
    @IsIn(['public', 'followers'])
    visibility: string;

    @IsNotEmpty()
    @IsString()
    license: string;

    @IsNotEmpty()
    @IsBoolean()
    downloadable: boolean;
}
