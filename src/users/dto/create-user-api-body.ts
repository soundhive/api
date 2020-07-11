import { ApiProperty } from '@nestjs/swagger';
import { BufferedFile } from 'src/minio-client/file.model';
import { ImageFileMediaTypes } from 'src/media-types';
import { CreateUserDTO } from './create-user.dto';

export class CreateUserAPIBody extends CreateUserDTO {
  @ApiProperty({
    type: 'file',
    description: `An image file of format ${
      Object.values(ImageFileMediaTypes).filter(
        (value) => typeof value === 'string',
      ) as string[]
    }`,
  })
  profile_picture: BufferedFile;
}
