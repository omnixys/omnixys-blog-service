import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.ts';
import { ReportService } from '../report/report.service.js';
import { CreateDraftInput } from './dto/create-draft.input.js';
import { UpdateDraftInput } from './dto/update-draft.input.js';

@Injectable()
export class DraftService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reportService: ReportService,
  ) {}

  async createDraft(userId: string, input: CreateDraftInput) {
    return this.reportService.create(userId, input);
  }

  async updateDraft(userId: string, input: UpdateDraftInput) {
    const report = await this.prisma.report.findUnique({
      where: { id: input.reportId },
      include: { author: true, draftSyncState: true },
    });

    if (!report) {
      throw new NotFoundException('Draft report not found.');
    }

    if (report.author.userId !== userId) {
      throw new ForbiddenException('You can edit only your own drafts.');
    }

    const updated = await this.reportService.update(userId, {
      reportId: input.reportId,
      title: input.title,
      excerpt: input.excerpt,
      coverImageUrl: input.coverImageUrl,
      contentJson: input.contentJson,
      contentText: input.contentText,
      visibility: input.visibility,
      categoryId: input.categoryId,
      tagNames: input.tagNames,
      changeSummary: input.changeSummary,
    });

    await this.prisma.draftSyncState.update({
      where: { reportId: input.reportId },
      data: {
        localVersion: input.localVersion,
        serverVersion: { increment: 1 },
        syncStatus: input.syncStatus,
        lastSyncedAt: new Date(),
      },
    });

    return updated;
  }

  async getDrafts(userId: string) {
    const author = await this.prisma.author.findUnique({
      where: { userId },
    });

    if (!author) {
      return [];
    }

    return this.prisma.report.findMany({
      where: {
        authorId: author.id,
        status: { in: ['DRAFT', 'IN_REVIEW', 'SCHEDULED'] },
      },
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
        draftSyncState: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
