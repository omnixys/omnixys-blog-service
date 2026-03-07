/**
 * @license GPL-3.0-or-later
 * Copyright (C) 2025 Caleb Gyamfi - Omnixys Technologies
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * For more information, visit <https://www.gnu.org/licenses/>.
 */

import { ApolloFederationDriver, type ApolloFederationDriverConfig } from '@nestjs/apollo';
import { type MiddlewareConsumer, Module, type NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { AnalyticsModule } from './analytics/analytics.module.ts';
import { AuthModule } from './auth/auth.module.ts';
// import { AdminModule } from './admin/admin.module.js';
import { env } from './config/env.js';
import { DraftModule } from './draft/draft.module.ts';
import { ExportModule } from './export/export.module.ts';
// import { ScalarsModule } from './core/scalars/scalar.module.js';
// import { HandlerModule } from './handlers/handler.module.js';
// import { HealthModule } from './health/health.module.js';
import { KafkaModule } from './kafka/kafka.module.js';
import { LoggerModule } from './logger/logger.module.js';
import { RequestLoggerMiddleware } from './logger/request-logger.middleware.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { PublishModule } from './publish/publish.module.ts';
import { ReportModule } from './report/report.module.ts';
import { SearchModule } from './search/search.module.ts';
import './common/enums/graphql.enums.js';
import { ScalarsModule } from './core/scalars/scalar.module.ts';

const { SCHEMA_TARGET } = env;

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    // CacheModule,
    // AuthorModule,
    ReportModule,
    DraftModule,
    PublishModule,
    ExportModule,
    // MediaModule,
    SearchModule,
    AnalyticsModule,
    // AdminModule,
    // HandlerModule,
    // HealthModule,
    LoggerModule,
    KafkaModule,
    ScalarsModule,
    // GraphQLModule.forRoot<ApolloDriverConfig>(graphQlModuleOptions),
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,

      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        // autoSchemaFile: join(process.cwd(), 'dist/schema.gql'),
        autoSchemaFile:
          SCHEMA_TARGET === 'tmp'
            ? { path: '/tmp/schema.gql', federation: 2 }
            : SCHEMA_TARGET === 'false'
              ? false
              : { path: 'dist/schema.gql', federation: 2 },
        sortSchema: true,
        playground: cfg.get('GRAPHQL_PLAYGROUND') === 'true',
        csrfPrevention: false,
        introspection: true,

        context: ({ req, res }: { req: FastifyRequest; res: FastifyReply }) => ({
          req,
          res,
        }),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
