import {
  Author,
  Category,
  PrismaClient,
  Report,
  ReportStatus,
  Tag,
} from '../../src/prisma/generated/client.ts';
import { markdownToEditorJson } from './utils/generateEditorJson.ts';
import { generateLongArticle } from './utils/generateReportContent.ts';
import { calculateReadingTime } from './utils/readingTime.ts';

export async function seedRealisticReports(
  prisma: PrismaClient,
  authors: Author[],
  categories: Category[],
  tags: Tag[],
) {
  const topics = [
    'Artificial Intelligence and the Future of Industry',
    'Global FinTech Infrastructure',
    'Cloud Native Architecture at Scale',
    'Cybersecurity Threat Landscape',
    'Digital Economy and Global Markets',
  ];

  const reports: Report[] = [];

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    const author = authors[i % authors.length];
    const category = categories[i % categories.length];

    const contentText = generateLongArticle(topic, 200);
    const contentJson = markdownToEditorJson(contentText);

    const reading = calculateReadingTime(contentText);

    const report = await prisma.report.create({
      data: {
        authorId: author.id,
        title: topic,
        slug: topic.toLowerCase().replace(/\s+/g, '-'),
        excerpt:
          'An extensive research report analyzing technological and economic trends shaping the next decade.',
        coverImageUrl: `https://picsum.photos/1200/600?${i}`,
        contentJson,
        contentText,
        status: ReportStatus.PUBLISHED,
        visibility: 'PUBLIC',
        categoryId: category.id,
        publishedAt: new Date(),
      },
    });

    await prisma.reportVersion.create({
      data: {
        reportId: report.id,
        versionNumber: 1,
        title: topic,
        contentJson,
        contentText,
        changeSummary: 'Initial publication',
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

    for (let t = 0; t < 4; t++) {
      const tag = tags[(i + t) % tags.length];

      await prisma.reportTag.create({
        data: {
          reportId: report.id,
          tagId: tag.id,
        },
      });
    }

    console.log(`Created report "${topic}" (${reading.words} words / ${reading.minutes} min read)`);

    reports.push(report);
  }

  return reports;
}
