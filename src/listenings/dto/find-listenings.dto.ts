import { IsDateString, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class FindListeningsDTO {
    @IsDateString()
    after: Date;

    @IsDateString()
    before: Date;

    @IsNotEmpty()
    @IsString()
    @IsIn(["hour", "day"])
    period: string;
}
