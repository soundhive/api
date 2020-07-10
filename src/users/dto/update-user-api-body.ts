import { ApiPropertyOptional } from '@nestjs/swagger';
import { BufferedFile } from 'src/minio-client/file.model';
import { UpdateUserDTO } from './update-user.dto';

export class UpdateUserAPIBody extends UpdateUserDTO {
  @ApiPropertyOptional({ type: 'file' })
  profile_picture: BufferedFile;
}
