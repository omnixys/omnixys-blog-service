import { Module } from '@nestjs/common';
import { ExportResolver } from './export.resolver.js';
import { ExportService } from './export.service.js';

@Module({
  providers: [ExportResolver, ExportService],
  exports: [ExportService],
})
export class ExportModule {}
