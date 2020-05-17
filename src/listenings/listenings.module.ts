import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Listening } from './listening.entity';
import { ListeningsService } from './listenings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Listening])],
  providers: [ListeningsService],
  exports: [ListeningsService]
})
export class ListeningsModule {}
