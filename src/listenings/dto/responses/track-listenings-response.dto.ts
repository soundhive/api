import { ApiProperty } from '@nestjs/swagger';
import { Keyframe } from 'src/listenings/keyframe';

export class TrackListeningsResponseDTO {
  @ApiProperty()
  listenings: number;

  @ApiProperty({ type: [Keyframe] })
  keyframes: Keyframe[];
}
