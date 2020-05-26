import { Track } from 'src/tracks/track.entity';
import { User } from 'src/users/user.entity';
import { Exists } from 'src/validators/exists.validation';

export class CreateListeningDTO {
    @Exists(Track)
    track: Track;

    @Exists(User)
    user: User;
}
