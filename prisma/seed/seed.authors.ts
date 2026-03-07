import { Author, PrismaClient } from '../../src/prisma/generated/client.js';

export async function seedAuthors(prisma: PrismaClient) {
  const authors: Author[] = [];

  for (let i = 1; i <= 3; i++) {
    const author = await prisma.author.create({
      data: {
        userId: `user-${i}`,
        username: `author${i}`,
        displayName: `Author ${i}`,
        bio: `Professional writer focusing on research and analysis.`,
        avatarUrl: `https://picsum.photos/200?${i}`,
      },
    });

    authors.push(author);
  }

  return authors;
}
