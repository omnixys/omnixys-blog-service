import { Module } from '@nestjs/common';
import { ReportResolver } from './report.resolver.js';
import { ReportService } from './report.service.js';

@Module({
  providers: [ReportResolver, ReportService],
  exports: [ReportService],
})
export class ReportModule {}
