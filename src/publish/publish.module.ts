import { Module } from '@nestjs/common';
import { PublishResolver } from './publish.resolver.js';
import { PublishService } from './publish.service.js';

@Module({
  providers: [PublishResolver, PublishService],
})
export class PublishModule {}
