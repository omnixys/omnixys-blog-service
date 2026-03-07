import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ReportStatus } from '../prisma/generated/client.ts';
import { PrismaService } from '../prisma/prisma.service.ts';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getReportAnalytics(userId: string, reportId: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: { author: true },
    });

    if (!report) {
      throw new NotFoundException('Report not found.');
    }

    if (report.author.userId !== userId) {
      throw new ForbiddenException('You can access analytics only for your own reports.');
    }

    const [views, durationAgg, reactions, comments, uniqueReaders] = await Promise.all([
      this.prisma.readingStat.count({ where: { reportId } }),
      this.prisma.readingStat.aggregate({
        where: { reportId },
        _avg: { readDurationSeconds: true },
      }),
      this.prisma.reaction.count({ where: { reportId } }),
      this.prisma.comment.count({ where: { reportId } }),
      this.prisma.readingStat.findMany({
        where: { reportId, sessionId: { not: null } },
        distinct: ['sessionId'],
        select: { sessionId: true },
      }),
    ]);

    const engagementRate = views > 0 ? ((reactions + comments) / views) * 100 : 0;

    return {
      reportId,
      views,
      uniqueReaders: uniqueReaders.length,
      avgReadDurationSeconds: durationAgg._avg.readDurationSeconds ?? 0,
      reactions,
      comments,
      engagementRate,
    };
  }

  async getAuthorAnalytics(userId: string) {
    const author = await this.prisma.author.findUnique({
      where: { userId },
    });

    if (!author) {
      throw new NotFoundException('Author profile not found.');
    }

    const reports = await this.prisma.report.findMany({
      where: { authorId: author.id },
      select: { id: true, status: true },
    });

    const reportIds = reports.map((r) => r.id);

    const [views, durationAgg, reactions, comments] = await Promise.all([
      this.prisma.readingStat.count({
        where: { reportId: { in: reportIds } },
      }),
      this.prisma.readingStat.aggregate({
        where: { reportId: { in: reportIds } },
        _avg: { readDurationSeconds: true },
      }),
      this.prisma.reaction.count({
        where: { reportId: { in: reportIds } },
      }),
      this.prisma.comment.count({
        where: { reportId: { in: reportIds } },
      }),
    ]);

    const publishedReports = reports.filter((r) => r.status === ReportStatus.PUBLISHED).length;
    const engagementRate = views > 0 ? ((reactions + comments) / views) * 100 : 0;

    return {
      authorId: author.id,
      totalReports: reports.length,
      publishedReports,
      totalViews: views,
      avgReadDurationSeconds: durationAgg._avg.readDurationSeconds ?? 0,
      totalReactions: reactions,
      totalComments: comments,
      engagementRate,
    };
  }
}
