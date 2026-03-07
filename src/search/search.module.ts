import { Module } from '@nestjs/common';
import { SearchResolver } from './search.resolver.js';
import { SearchService } from './search.service.js';

@Module({
  providers: [SearchResolver, SearchService],
})
export class SearchModule {}
