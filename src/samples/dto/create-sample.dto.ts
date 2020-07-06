import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsIn,
    // IsBoolean,
} from 'class-validator';

export class CreateSampleDTO {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    @IsIn(['public', 'followers'])
    visibility: string;

    @IsNotEmpty()
    @IsString()
    license: string;

    // @IsNotEmpty()
    // @IsBoolean()
    downloadable: boolean;
}
