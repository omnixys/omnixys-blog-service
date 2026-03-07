import { Injectable } from '@nestjs/common';
import { ReportStatus } from '../prisma/generated/client.ts';
import { PrismaService } from '../prisma/prisma.service.ts';
import { SearchReportsArgs } from './dto/search-reports.args.js';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchReports(args: SearchReportsArgs) {
    const where = {
      status: ReportStatus.PUBLISHED,
      OR: [
        {
          title: {
            contains: args.query,
            mode: 'insensitive' as const,
          },
        },
        {
          contentText: {
            contains: args.query,
            mode: 'insensitive' as const,
          },
        },
        {
          tags: {
            some: {
              tag: {
                OR: [
                  {
                    name: {
                      contains: args.query,
                      mode: 'insensitive' as const,
                    },
                  },
                  {
                    slug: {
                      contains: args.query,
                      mode: 'insensitive' as const,
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.report.findMany({
        where,
        include: {
          author: true,
          category: true,
          tags: { include: { tag: true } },
        },
        orderBy: { publishedAt: 'desc' },
        skip: args.offset,
        take: args.limit,
      }),
      this.prisma.report.count({ where }),
    ]);

    return { items, total };
  }
}
