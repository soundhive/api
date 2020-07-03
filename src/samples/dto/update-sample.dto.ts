import { IsNotEmpty, IsString, IsOptional, IsIn, IsBoolean } from 'class-validator';

export class UpdateSampleDTO {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    genre: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    filename: string;

    @IsOptional()
    @IsString()
    @IsIn(['public', 'followers'])
    visibility: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    license: string;

    @IsOptional()
    @IsNotEmpty()
    @IsBoolean()
    downloadable: boolean;
}
