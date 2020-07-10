import { ApiPropertyOptional } from '@nestjs/swagger';
import { BufferedFile } from 'src/minio-client/file.model';
import { UpdateAlbumDTO } from './update-album.dto';

export class UpdateAlbumAPIBody extends UpdateAlbumDTO {
  @ApiPropertyOptional({ type: 'file' })
  coverFile?: BufferedFile;
}
