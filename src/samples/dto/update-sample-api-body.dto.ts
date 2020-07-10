import { ApiPropertyOptional } from '@nestjs/swagger';
import { BufferedFile } from 'src/minio-client/file.model';
import { SampleFileMediaType } from '../samples.entity';
import { UpdateSampleDTO } from './update-sample.dto';

export class UpdateSampleAPIBody extends UpdateSampleDTO {
  @ApiPropertyOptional({
    type: 'file',
    description: `An audio file of format ${
      Object.values(SampleFileMediaType).filter(
        (value) => typeof value === 'string',
      ) as string[]
    }`,
  })
  sampleFile: BufferedFile;
}
