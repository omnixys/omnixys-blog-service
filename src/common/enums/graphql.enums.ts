import { registerEnumType } from '@nestjs/graphql';
import {
  ExportJobStatus,
  ExportType,
  ReactionType,
  ReportStatus,
  SyncStatus,
  Visibility,
} from '../../prisma/generated/client.ts';

registerEnumType(ReportStatus, { name: 'ReportStatus' });
registerEnumType(Visibility, { name: 'Visibility' });
registerEnumType(ExportType, { name: 'ExportType' });
registerEnumType(SyncStatus, { name: 'SyncStatus' });
registerEnumType(ExportJobStatus, { name: 'ExportJobStatus' });
registerEnumType(ReactionType, { name: 'ReactionType' });
