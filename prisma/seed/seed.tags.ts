import { PrismaClient, Tag } from '../../src/prisma/generated/client.js';

const tags = [
  'AI',
  'Machine Learning',
  'GraphQL',
  'Cloud',
  'FinTech',
  'Startups',
  'Research',
  'Economics',
  'Cybersecurity',
];

export async function seedTags(prisma: PrismaClient) {
  const result: Tag[] = [];

  for (const tagName of tags) {
    const slug = tagName.toLowerCase().replace(/\s+/g, '-');

    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: {
        name: tagName,
        slug,
      },
    });

    result.push(tag);
  }

  return result;
}
