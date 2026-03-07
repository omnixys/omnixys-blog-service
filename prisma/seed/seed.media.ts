import { Author, PrismaClient, Report } from '../../src/prisma/generated/client.js';

export async function seedMedia(prisma: PrismaClient, authors: Author[], reports: Report[]) {
  for (const report of reports) {
    const author = authors[0];

    await prisma.mediaAsset.create({
      data: {
        reportId: report.id,
        authorId: author.id,
        mimeType: 'image/jpeg',
        fileName: 'cover.jpg',
        storageKey: `reports/${report.id}/cover.jpg`,
        fileSize: 120000,
      },
    });
  }
}
