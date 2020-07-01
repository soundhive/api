import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
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
  @IsString()
  license: string;

  @IsNotEmpty()
  @IsBoolean()
  downloadable: string;

  @IsNotEmpty()
  @Exists(Album)
  album: Album;

  @IsNotEmpty()
  @Exists(User)
  user: User;
}
