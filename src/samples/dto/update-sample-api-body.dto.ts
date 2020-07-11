import { ApiPropertyOptional } from '@nestjs/swagger';
import { BufferedFile } from 'src/minio-client/file.model';
import { AudioFileMediaType } from 'src/media-types';
import { UpdateSampleDTO } from './update-sample.dto';

export class UpdateSampleAPIBody extends UpdateSampleDTO {
  @ApiPropertyOptional({
    type: 'file',
    description: `An audio file of format ${
      Object.values(AudioFileMediaType).filter(
        (value) => typeof value === 'string',
      ) as string[]
    }`,
  })
  sampleFile: BufferedFile;
}
