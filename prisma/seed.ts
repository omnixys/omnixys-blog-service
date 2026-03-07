import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/prisma/generated/client.js';
import 'dotenv/config';
import { seedAuthors } from './seed/seed.authors.ts';
import { seedCategories } from './seed/seed.categories.ts';
import { seedComments } from './seed/seed.comments.ts';
import { seedExportJobs } from './seed/seed.exports.ts';
import { seedMedia } from './seed/seed.media.ts';
import { seedReactions } from './seed/seed.reactions.ts';
import { seedReadingStats } from './seed/seed.readingStats.ts';
import { seedRealisticReports } from './seed/seed.reports.realistic.ts';
import { seedReports } from './seed/seed.reports.ts';
import { seedTags } from './seed/seed.tags.ts';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding Bloxys database...');

  const authors = await seedAuthors(prisma);
  const categories = await seedCategories(prisma);
  const tags = await seedTags(prisma);

  const reports = await seedReports(prisma, authors, categories, tags);

  await seedMedia(prisma, authors, reports);
  await seedComments(prisma, authors, reports);
  await seedReactions(prisma, authors, reports);
  await seedReadingStats(prisma, authors, reports);
  await seedExportJobs(prisma, authors, reports);

  const reports2 = await seedRealisticReports(prisma, authors, categories, tags);

  await seedMedia(prisma, authors, reports2);
  await seedComments(prisma, authors, reports2);
  await seedReactions(prisma, authors, reports2);
  await seedReadingStats(prisma, authors, reports2);
  await seedExportJobs(prisma, authors, reports2);

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
