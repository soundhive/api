import { ApiProperty } from '@nestjs/swagger';
import { BufferedFile } from 'src/minio-client/file.model';
import { CreateAlbumDTO } from './create-album.dto';

export class CreateAlbumAPIBody extends CreateAlbumDTO {
  @ApiProperty({ type: 'file' })
  coverFile: BufferedFile;
}
