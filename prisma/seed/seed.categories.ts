import { Category, PrismaClient } from '../../src/prisma/generated/client.js';

const categories = [
  { name: 'Technology', slug: 'technology' },
  { name: 'Finance', slug: 'finance' },
  { name: 'Research', slug: 'research' },
  { name: 'Society', slug: 'society' },
  { name: 'Innovation', slug: 'innovation' },
];

export async function seedCategories(prisma: PrismaClient) {
  const result: Category[] = [];

  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });

    result.push(created);
  }

  return result;
}
