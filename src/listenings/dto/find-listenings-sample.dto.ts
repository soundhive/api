import {
    IsDateString,
    IsIn,
    IsNotEmpty,
    IsString,
    IsUUID,
} from 'class-validator';
import { Exists } from 'src/validators/exists.validation';
import { Sample } from 'src/samples/samples.entity';

export class FindListeningsForSampleDTO {
    @IsUUID('all')
    @Exists(Sample)
    id: string;

    @IsDateString()
    after: Date;

    @IsDateString()
    before: Date;

    @IsNotEmpty()
    @IsString()
    @IsIn(['hour', 'day', 'week', 'month', 'year'])
    period: string;
}
