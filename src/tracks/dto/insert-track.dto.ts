import { IsNotEmpty, IsString } from 'class-validator';
import { Album } from 'src/albums/album.entity';
import { User } from 'src/users/user.entity';
import { Exists } from 'src/validators/exists.validation';

export class InsertTrackDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  genre: string;

  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsNotEmpty()
  @Exists(Album)
  album: Album;

  @IsNotEmpty()
  @Exists(User)
  user: User;
}
