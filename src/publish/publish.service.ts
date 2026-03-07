import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ReportStatus } from '../prisma/generated/client.ts';
import { PrismaService } from '../prisma/prisma.service.ts';
import { PublishReportInput } from './dto/publish-report.input.js';
import { ScheduleReportInput } from './dto/schedule-report.input.js';

@Injectable()
export class PublishService {
  constructor(private readonly prisma: PrismaService) {}

  async publishReport(userId: string, input: PublishReportInput) {
    const report = await this.prisma.report.findUnique({
      where: { id: input.reportId },
      include: { author: true },
    });

    if (!report) {
      throw new NotFoundException('Report not found.');
    }

    if (report.author.userId !== userId) {
      throw new ForbiddenException('You can publish only your own reports.');
    }

    return this.prisma.report.update({
      where: { id: input.reportId },
      data: {
        status: ReportStatus.PUBLISHED,
        visibility: input.visibility ?? report.visibility,
        publishedAt: new Date(),
        scheduledAt: null,
      },
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
      },
    });
  }

  async scheduleReport(userId: string, input: ScheduleReportInput) {
    const report = await this.prisma.report.findUnique({
      where: { id: input.reportId },
      include: { author: true },
    });

    if (!report) {
      throw new NotFoundException('Report not found.');
    }

    if (report.author.userId !== userId) {
      throw new ForbiddenException('You can schedule only your own reports.');
    }

    return this.prisma.report.update({
      where: { id: input.reportId },
      data: {
        status: ReportStatus.SCHEDULED,
        scheduledAt: input.scheduledAt,
        visibility: input.visibility ?? report.visibility,
      },
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
      },
    });
  }
}
