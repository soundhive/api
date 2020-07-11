import { ApiProperty } from '@nestjs/swagger';
import { BufferedFile } from 'src/minio-client/file.model';
import { AudioFileMediaType } from 'src/media-types';
import { CreateTrackDTO } from './create-track.dto';

export class CreateTrackAPIBody extends CreateTrackDTO {
  @ApiProperty({
    type: 'file',
    description: `An audio file of format ${
      Object.values(AudioFileMediaType).filter(
        (value) => typeof value === 'string',
      ) as string[]
    }`,
  })
  track_file: BufferedFile;
}
