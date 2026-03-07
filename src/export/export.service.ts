import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ExportJobStatus } from '../prisma/generated/client.ts';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreateExportInput } from './dto/create-export.input.js';

@Injectable()
export class ExportService {
  constructor(private readonly prisma: PrismaService) {}

  async createExport(userId: string, input: CreateExportInput) {
    const report = await this.prisma.report.findUnique({
      where: { id: input.reportId },
      include: { author: true },
    });

    if (!report) {
      throw new NotFoundException('Report not found.');
    }

    if (report.author.userId !== userId) {
      throw new ForbiddenException('You can export only your own reports.');
    }

    return this.prisma.exportJob.create({
      data: {
        reportId: report.id,
        authorId: report.authorId,
        exportType: input.exportType,
        status: ExportJobStatus.PENDING,
      },
    });
  }

  async getExportJobs(userId: string) {
    const author = await this.prisma.author.findUnique({
      where: { userId },
    });

    if (!author) {
      return [];
    }

    return this.prisma.exportJob.findMany({
      where: { authorId: author.id },
      include: {
        report: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markProcessing(jobId: string) {
    return this.prisma.exportJob.update({
      where: { id: jobId },
      data: {
        status: ExportJobStatus.PROCESSING,
      },
    });
  }

  async markCompleted(jobId: string, storageKey: string) {
    return this.prisma.exportJob.update({
      where: { id: jobId },
      data: {
        status: ExportJobStatus.COMPLETED,
        storageKey,
        completedAt: new Date(),
      },
    });
  }

  async markFailed(jobId: string, reason: string) {
    return this.prisma.exportJob.update({
      where: { id: jobId },
      data: {
        status: ExportJobStatus.FAILED,
        failureReason: reason,
      },
    });
  }
}
