import { Module } from '@nestjs/common';
import { SamplesController } from './samples.controller';

@Module({
  controllers: [SamplesController]
})
export class SampleModule {}
