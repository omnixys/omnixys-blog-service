import { Author, PrismaClient, ReactionType, Report } from '../../src/prisma/generated/client.js';

export async function seedReactions(prisma: PrismaClient, authors: Author[], reports: Report[]) {
  for (const report of reports) {
    for (const author of authors) {
      await prisma.reaction.create({
        data: {
          reportId: report.id,
          authorId: author.id,
          type: ReactionType.CLAP,
        },
      });
    }
  }
}
