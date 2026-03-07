import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator.ts';
import { CookieAuthGuard } from '../auth/guards/cookie-auth.guard.ts';
import { ReportEntity } from '../report/entity/report.entity.js';
import { DraftService } from './draft.service.js';
import { CreateDraftInput } from './dto/create-draft.input.js';
import { UpdateDraftInput } from './dto/update-draft.input.js';

@Resolver()
export class DraftResolver {
  constructor(private readonly draftService: DraftService) {}

  @UseGuards(CookieAuthGuard)
  @Mutation(() => ReportEntity)
  async createDraft(@CurrentUser() user: CurrentUserData, @Args('input') input: CreateDraftInput) {
    return this.draftService.createDraft(user.id, input);
  }

  @UseGuards(CookieAuthGuard)
  @Mutation(() => ReportEntity)
  async updateDraft(@CurrentUser() user: CurrentUserData, @Args('input') input: UpdateDraftInput) {
    return this.draftService.updateDraft(user.id, input);
  }

  @UseGuards(CookieAuthGuard)
  @Query(() => [ReportEntity])
  async getDrafts(@CurrentUser() user: CurrentUserData) {
    return this.draftService.getDrafts(user.id);
  }
}
