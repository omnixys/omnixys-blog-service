import { Author, PrismaClient, Report } from '../../src/prisma/generated/client.js';

export async function seedComments(prisma: PrismaClient, authors: Author[], reports: Report[]) {
  for (const report of reports) {
    for (let i = 0; i < 2; i++) {
      const author = authors[i % authors.length];

      await prisma.comment.create({
        data: {
          reportId: report.id,
          authorId: author.id,
          content: 'Excellent insights. This report was very informative.',
        },
      });
    }
  }
}
