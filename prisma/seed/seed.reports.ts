import {
  Author,
  Category,
  Prisma,
  PrismaClient,
  Report,
  ReportStatus,
  Tag,
} from '../../src/prisma/generated/client.js';

export async function seedReports(
  prisma: PrismaClient,
  authors: Author[],
  categories: Category[],
  tags: Tag[],
) {
  const reports: Report[] = [];

  for (let i = 1; i <= 6; i++) {
    const author = authors[i % authors.length];
    const category = categories[i % categories.length];

    const report = await prisma.report.create({
      data: {
        authorId: author.id,
        title: `Research Report ${i}`,
        slug: `research-report-${i}`,
        excerpt: 'An in-depth analysis of emerging technology trends.',
        contentJson: {
          type: 'doc',
          content: [],
        },
        contentText:
          'This report explores emerging technological innovations and their impact on modern industries.',
        coverImageUrl: `https://picsum.photos/800/400?${i}`,
        status: i % 2 === 0 ? ReportStatus.PUBLISHED : ReportStatus.DRAFT,
        visibility: 'PUBLIC',
        categoryId: category.id,
        publishedAt: i % 2 === 0 ? new Date() : null,
      },
    });

    await prisma.reportVersion.create({
      data: {
        reportId: report.id,
        versionNumber: 1,
        title: report.title,
        contentJson: report.contentJson as Prisma.InputJsonValue,
        contentText: report.contentText,
        changeSummary: 'Initial version',
        createdBy: author.id,
      },
    });

    await prisma.draftSyncState.create({
      data: {
        reportId: report.id,
        authorId: author.id,
        localVersion: 1,
        serverVersion: 1,
        syncStatus: 'SYNCED',
      },
    });

    for (let t = 0; t < 3; t++) {
      const tag = tags[(i + t) % tags.length];

      await prisma.reportTag.create({
        data: {
          reportId: report.id,
          tagId: tag.id,
        },
      });
    }

    reports.push(report);
  }

  return reports;
}
