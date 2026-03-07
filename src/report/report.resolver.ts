import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator.ts';
import { CookieAuthGuard } from '../auth/guards/cookie-auth.guard.ts';
import { CreateReportInput } from './dto/create-report.input.js';
import { UpdateReportInput } from './dto/update-report.input.js';
import { ReportEntity } from './entity/report.entity.js';
import { ReportService } from './report.service.js';

@Resolver(() => ReportEntity)
export class ReportResolver {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(CookieAuthGuard)
  @Mutation(() => ReportEntity)
  async createReport(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: CreateReportInput,
  ) {
    return this.reportService.create(user.id, input);
  }

  @UseGuards(CookieAuthGuard)
  @Mutation(() => ReportEntity)
  async updateReport(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: UpdateReportInput,
  ) {
    return this.reportService.update(user.id, input);
  }

  @Query(() => ReportEntity, { nullable: true })
  async getReport(
    @Args('reportId', { type: () => ID, nullable: true }) reportId?: string,
    @Args('slug', { nullable: true }) slug?: string,
  ) {
    if (reportId) return this.reportService.getById(reportId);
    if (slug) return this.reportService.getBySlug(slug);
    return null;
  }

  @Query(() => [ReportEntity])
  async getReports(
    @Args('mine', { nullable: true, defaultValue: false }) mine?: boolean,
    @CurrentUser() user?: CurrentUserData | null,
  ) {
    return this.reportService.getReports(mine ? user?.id : undefined);
  }
}
