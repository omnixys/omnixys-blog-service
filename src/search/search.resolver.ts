import { Args, Query, Resolver } from '@nestjs/graphql';
import { SearchReportsArgs } from './dto/search-reports.args.js';
import { SearchResultEntity } from './entity/search-result.entity.js';
import { SearchService } from './search.service.js';

@Resolver()
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => SearchResultEntity)
  async searchReports(@Args() args: SearchReportsArgs) {
    return this.searchService.searchReports(args);
  }
}
