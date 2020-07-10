import { ApiProperty } from '@nestjs/swagger';
import { BufferedFile } from 'src/minio-client/file.model';
import { CreateSampleDTO } from './create-sample.dto';
import { SampleFileMediaType } from '../samples.entity';

export class CreateSampleAPIBody extends CreateSampleDTO {
  @ApiProperty({
    type: 'file',
    description: `An audio file of format ${
      Object.values(SampleFileMediaType).filter(
        (value) => typeof value === 'string',
      ) as string[]
    }`,
  })
  sampleFile: BufferedFile;
}
