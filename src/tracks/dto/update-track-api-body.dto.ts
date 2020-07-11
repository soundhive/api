import { ApiPropertyOptional } from '@nestjs/swagger';
import { BufferedFile } from 'src/minio-client/file.model';
import { AudioFileMediaType } from 'src/media-types';
import { UpdateTrackDTO } from './update-track.dto';

export class UpdateTrackAPIBody extends UpdateTrackDTO {
  @ApiPropertyOptional({
    type: 'file',
    description: `An audio file of format ${
      Object.values(AudioFileMediaType).filter(
        (value) => typeof value === 'string',
      ) as string[]
    }`,
  })
  trackFile?: BufferedFile;
}
