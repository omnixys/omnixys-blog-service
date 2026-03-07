import { Module } from '@nestjs/common';
import { JsonScalar } from './json.scalar.js';

@Module({
  providers: [JsonScalar],
  exports: [JsonScalar],
})
export class ScalarsModule {}
