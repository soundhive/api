import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';

export class CreateSampleDTO {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    genre: string;

    @IsOptional()
    @IsString()
    @IsIn(["public", "followers"])
    visibility: string;
}
