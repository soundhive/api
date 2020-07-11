import { Album } from 'src/albums/album.entity';
import { User } from 'src/users/user.entity';

export class InsertTrackDTO {
  title: string;

  description: string;

  genre: string;

  license: string;

  downloadable: boolean;

  album: Album;

  user: User;
}
