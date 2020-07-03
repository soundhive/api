import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Exists } from 'src/validators/exists.validation';
import { User } from 'src/users/user.entity';

export class InsertAlbumDTO {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    description?: string;

    @IsNotEmpty()
    @IsString()
    coverFilename: string;

    @IsNotEmpty()
    @Exists(User)
    user: User;
}
