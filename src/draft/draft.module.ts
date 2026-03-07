import { Module } from '@nestjs/common';
import { ReportModule } from '../report/report.module.js';
import { DraftResolver } from './draft.resolver.js';
import { DraftService } from './draft.service.js';

@Module({
  imports: [ReportModule],
  providers: [DraftResolver, DraftService],
})
export class DraftModule {}
