import { ApiProperty } from '@nestjs/swagger';
import { BufferedFile } from 'src/minio-client/file.model';
import { CreateUserDTO } from './create-user.dto';

export class CreateUserAPIBody extends CreateUserDTO {
  @ApiProperty({ type: 'file' })
  profile_picture: BufferedFile;
}
