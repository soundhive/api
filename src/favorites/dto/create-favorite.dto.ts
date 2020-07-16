import { Track } from 'src/tracks/track.entity';
import { User } from 'src/users/user.entity';
import { Exists } from 'src/shared/validators/exists.validation';

export class CreateFavoriteDTO {
  @Exists(Track)
  track: Track;

  @Exists(User)
  user: User;
}
