import { Author, PrismaClient, Report } from '../../src/prisma/generated/client.js';

export async function seedReadingStats(prisma: PrismaClient, authors: Author[], reports: Report[]) {
  for (const report of reports) {
    for (let i = 0; i < 20; i++) {
      await prisma.readingStat.create({
        data: {
          reportId: report.id,
          readDurationSeconds: Math.floor(Math.random() * 200),
          sessionId: `session-${i}`,
          source: 'web',
          userAgent: 'Chrome',
        },
      });
    }
  }
}
