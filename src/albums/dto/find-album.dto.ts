import { IsUUID } from 'class-validator';
import { Exists } from '../../validators/exists.validation';
import { Album } from '../album.entity';

export class FindAlbumDTO {
    @IsUUID('all')
    @Exists(Album)
    id: string;
}
