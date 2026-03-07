import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { toSlug } from '../common/utils/slug.util.js';
import { Prisma, ReportStatus } from '../prisma/generated/client.ts';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreateReportInput } from './dto/create-report.input.js';
import { UpdateReportInput } from './dto/update-report.input.js';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async create(authorUserId: string, input: CreateReportInput) {
    const author = await this.prisma.author.findUnique({
      where: { userId: authorUserId },
    });

    if (!author) {
      throw new NotFoundException('Author profile not found.');
    }

    const slugBase = toSlug(input.title);
    const slug = await this.ensureUniqueSlug(slugBase);

    return this.prisma.$transaction(async (tx) => {
      const report = await tx.report.create({
        data: {
          authorId: author.id,
          title: input.title,
          slug,
          excerpt: input.excerpt,
          coverImageUrl: input.coverImageUrl,
          contentJson: JSON.parse(input.contentJson),
          contentText: input.contentText,
          visibility: input.visibility,
          categoryId: input.categoryId,
          status: ReportStatus.DRAFT,
        },
      });

      await tx.reportVersion.create({
        data: {
          reportId: report.id,
          versionNumber: 1,
          title: report.title,
          contentJson: report.contentJson as any,
          contentText: report.contentText,
          changeSummary: 'Initial draft created',
          createdBy: author.id,
        },
      });

      await tx.draftSyncState.create({
        data: {
          reportId: report.id,
          authorId: author.id,
          localVersion: 1,
          serverVersion: 1,
        },
      });

      await this.syncTags(tx, report.id, input.tagNames);

      return tx.report.findUniqueOrThrow({
        where: { id: report.id },
        include: {
          author: true,
          category: true,
          tags: { include: { tag: true } },
        },
      });
    });
  }

  async update(authorUserId: string, input: UpdateReportInput) {
    const report = await this.prisma.report.findUnique({
      where: { id: input.reportId },
      include: { author: true },
    });

    if (!report) {
      throw new NotFoundException('Report not found.');
    }

    if (report.author.userId !== authorUserId) {
      throw new ForbiddenException('You can edit only your own reports.');
    }

    return this.prisma.$transaction(async (tx) => {
      const nextVersion = (await tx.reportVersion.count({ where: { reportId: report.id } })) + 1;

      const updated = await tx.report.update({
        where: { id: report.id },
        data: {
          title: input.title ?? report.title,
          excerpt: input.excerpt ?? report.excerpt,
          coverImageUrl: input.coverImageUrl ?? report.coverImageUrl,
          contentJson: input.contentJson ? JSON.parse(input.contentJson) : report.contentJson,
          contentText: input.contentText ?? report.contentText,
          visibility: input.visibility ?? report.visibility,
          categoryId: input.categoryId ?? report.categoryId,
        },
      });

      await tx.reportVersion.create({
        data: {
          reportId: report.id,
          versionNumber: nextVersion,
          title: updated.title,
          contentJson: updated.contentJson as any,
          contentText: updated.contentText,
          changeSummary: input.changeSummary ?? 'Report updated',
          createdBy: report.authorId,
        },
      });

      if (input.tagNames) {
        await this.syncTags(tx, report.id, input.tagNames);
      }

      return tx.report.findUniqueOrThrow({
        where: { id: report.id },
        include: {
          author: true,
          category: true,
          tags: { include: { tag: true } },
        },
      });
    });
  }

  async getById(reportId: string) {
    return this.prisma.report.findUnique({
      where: { id: reportId },
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
      },
    });
  }

  async getBySlug(slug: string) {
    return this.prisma.report.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
      },
    });
  }

  async getReports(authorUserId?: string) {
    if (authorUserId) {
      const author = await this.prisma.author.findUnique({
        where: { userId: authorUserId },
      });

      return this.prisma.report.findMany({
        where: author ? { authorId: author.id } : undefined,
        include: {
          author: true,
          category: true,
          tags: { include: { tag: true } },
        },
        orderBy: { updatedAt: 'desc' },
      });
    }

    return this.prisma.report.findMany({
      where: { status: ReportStatus.PUBLISHED },
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { publishedAt: 'desc' },
    });
  }

  private async ensureUniqueSlug(base: string): Promise<string> {
    let candidate = base;
    let counter = 1;

    while (await this.prisma.report.findUnique({ where: { slug: candidate } })) {
      candidate = `${base}-${counter++}`;
    }

    return candidate;
  }

  private async syncTags(tx: Prisma.TransactionClient, reportId: string, tagNames: string[]) {
    await tx.reportTag.deleteMany({ where: { reportId } });

    for (const rawName of tagNames) {
      const name = rawName.trim();
      const slug = toSlug(name);

      const tag = await tx.tag.upsert({
        where: { slug },
        update: { name },
        create: { name, slug },
      });

      await tx.reportTag.create({
        data: {
          reportId,
          tagId: tag.id,
        },
      });
    }
  }
}
