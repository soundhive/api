import { ApiProperty } from '@nestjs/swagger';
import { BufferedFile } from 'src/minio-client/file.model';
import { ImageFileMediaTypes } from 'src/media-types';
import { CreatePlaylistDTO } from './create-playlist.dto';

export class CreatePlaylistAPIBody extends CreatePlaylistDTO {
  @ApiProperty({
    type: 'file',
    description: `An image file of format ${
      Object.values(ImageFileMediaTypes).filter(
        (value) => typeof value === 'string',
      ) as string[]
    }`,
  })
  cover_file: BufferedFile;
}
