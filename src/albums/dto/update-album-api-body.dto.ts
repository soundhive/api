import { ApiPropertyOptional } from '@nestjs/swagger';
import { BufferedFile } from 'src/minio-client/file.model';
import { ImageFileMediaTypes } from 'src/media-types';
import { UpdateAlbumDTO } from './update-album.dto';

export class UpdateAlbumAPIBody extends UpdateAlbumDTO {
  @ApiPropertyOptional({
    type: 'file',
    description: `An audio file of format ${
      Object.values(ImageFileMediaTypes).filter(
        (value) => typeof value === 'string',
      ) as string[]
    }`,
  })
  coverFile?: BufferedFile;
}
