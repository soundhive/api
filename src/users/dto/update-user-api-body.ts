import { ApiPropertyOptional } from '@nestjs/swagger';
import { BufferedFile } from 'src/minio-client/file.model';
import { ImageFileMediaTypes } from 'src/media-types';
import { UpdateUserDTO } from './update-user.dto';

export class UpdateUserAPIBody extends UpdateUserDTO {
  @ApiPropertyOptional({
    type: 'file',
    description: `An image file of format ${
      Object.values(ImageFileMediaTypes).filter(
        (value) => typeof value === 'string',
      ) as string[]
    }`,
  })
  profile_picture: BufferedFile;
}
