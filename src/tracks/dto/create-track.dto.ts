import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTrackDTO {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    genre: string;

    @IsNotEmpty()
    @IsString()
    license: string;

    // @IsNotEmpty()
    // @IsBoolean()
    downloadable: boolean;

    @IsNotEmpty()
    @IsUUID('all')
    album: string;
}
