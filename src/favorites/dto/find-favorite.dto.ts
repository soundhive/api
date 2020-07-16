import { Exists } from 'src/shared/validators/exists.validation';
import { User } from 'src/users/user.entity';
import { Track } from 'src/tracks/track.entity';

export class FindFavoriteDTO {
  @Exists(Track)
  track: Track;

  @Exists(User)
  user: User;
}
