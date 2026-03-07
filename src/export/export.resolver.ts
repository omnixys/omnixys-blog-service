import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator.ts';
import { CookieAuthGuard } from '../auth/guards/cookie-auth.guard.ts';
import { CreateExportInput } from './dto/create-export.input.js';
import { ExportJobEntity } from './entity/export-job.entity.js';
import { ExportService } from './export.service.js';

@Resolver()
export class ExportResolver {
  constructor(private readonly exportService: ExportService) {}

  @UseGuards(CookieAuthGuard)
  @Mutation(() => ExportJobEntity)
  async createExport(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: CreateExportInput,
  ) {
    return this.exportService.createExport(user.id, input);
  }

  @UseGuards(CookieAuthGuard)
  @Query(() => [ExportJobEntity])
  async getExportJobs(@CurrentUser() user: CurrentUserData) {
    return this.exportService.getExportJobs(user.id);
  }
}
