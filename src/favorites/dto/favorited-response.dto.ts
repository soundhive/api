import { ApiProperty } from '@nestjs/swagger';

export class FavoritedResponseDTO {
  @ApiProperty()
  favorited: boolean;
}
