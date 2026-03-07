import { UseGuards } from '@nestjs/common';
import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator.ts';
import { CookieAuthGuard } from '../auth/guards/cookie-auth.guard.ts';
import { AnalyticsService } from './analytics.service.js';
import { AuthorAnalyticsEntity } from './entity/author-analytics.entity.js';
import { ReportAnalyticsEntity } from './entity/report-analytics.entity.js';

@Resolver()
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(CookieAuthGuard)
  @Query(() => ReportAnalyticsEntity)
  async getReportAnalytics(
    @CurrentUser() user: CurrentUserData,
    @Args('reportId', { type: () => ID }) reportId: string,
  ) {
    return this.analyticsService.getReportAnalytics(user.id, reportId);
  }

  @UseGuards(CookieAuthGuard)
  @Query(() => AuthorAnalyticsEntity)
  async getAuthorAnalytics(@CurrentUser() user: CurrentUserData) {
    return this.analyticsService.getAuthorAnalytics(user.id);
  }
}
