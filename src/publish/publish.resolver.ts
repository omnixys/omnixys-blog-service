import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator.ts';
import { CookieAuthGuard } from '../auth/guards/cookie-auth.guard.ts';
import { ReportEntity } from '../report/entity/report.entity.js';
import { PublishReportInput } from './dto/publish-report.input.js';
import { ScheduleReportInput } from './dto/schedule-report.input.js';
import { PublishService } from './publish.service.js';

@Resolver()
export class PublishResolver {
  constructor(private readonly publishService: PublishService) {}

  @UseGuards(CookieAuthGuard)
  @Mutation(() => ReportEntity)
  async publishReport(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: PublishReportInput,
  ) {
    return this.publishService.publishReport(user.id, input);
  }

  @UseGuards(CookieAuthGuard)
  @Mutation(() => ReportEntity)
  async scheduleReport(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: ScheduleReportInput,
  ) {
    return this.publishService.scheduleReport(user.id, input);
  }
}
