import { ApiProperty } from '@nestjs/swagger';
import { BufferedFile } from 'src/minio-client/file.model';
import { ImageFileMediaTypes } from 'src/media-types';
import { CreateAlbumDTO } from './create-album.dto';

export class CreateAlbumAPIBody extends CreateAlbumDTO {
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
