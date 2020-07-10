import { ApiPropertyOptional } from '@nestjs/swagger';
import { BufferedFile } from 'src/minio-client/file.model';
import { UpdateTrackDTO } from './update-track.dto';
import { TrackFileMediaType } from '../track.entity';

export class UpdateTrackAPIBody extends UpdateTrackDTO {
  @ApiPropertyOptional({
    type: 'file',
    description: `An audio file of format ${
      Object.values(TrackFileMediaType).filter(
        (value) => typeof value === 'string',
      ) as string[]
    }`,
  })
  trackFile?: BufferedFile;
}
