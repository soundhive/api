import { ApiProperty } from '@nestjs/swagger';
import { BufferedFile } from 'src/minio-client/file.model';
import { CreateTrackDTO } from './create-track.dto';
import { TrackFileMediaType } from '../track.entity';

export class CreateTrackAPIBody extends CreateTrackDTO {
  @ApiProperty({
    type: 'file',
    description: `An audio file of format ${
      Object.values(TrackFileMediaType).filter(
        (value) => typeof value === 'string',
      ) as string[]
    }`,
  })
  trackFile: BufferedFile;
}
