import { ApiProperty } from '@nestjs/swagger';
import { BufferedFile } from 'src/minio-client/file.model';
import { AudioFileMediaType } from 'src/media-types';
import { CreateSampleDTO } from './create-sample.dto';

export class CreateSampleAPIBody extends CreateSampleDTO {
  @ApiProperty({
    type: 'file',
    description: `An audio file of format ${
      Object.values(AudioFileMediaType).filter(
        (value) => typeof value === 'string',
      ) as string[]
    }`,
  })
  sampleFile: BufferedFile;
}
