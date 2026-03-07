import {
  Author,
  ExportJobStatus,
  ExportType,
  PrismaClient,
  Report,
} from '../../src/prisma/generated/client.js';

export async function seedExportJobs(prisma: PrismaClient, authors: Author[], reports: Report[]) {
  for (const report of reports.slice(0, 3)) {
    const author = authors[0];

    await prisma.exportJob.create({
      data: {
        reportId: report.id,
        authorId: author.id,
        exportType: ExportType.PDF,
        status: ExportJobStatus.COMPLETED,
        storageKey: `exports/${report.id}/report.pdf`,
        completedAt: new Date(),
      },
    });
  }
}
