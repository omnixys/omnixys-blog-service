import { Field, ID, InputType } from '@nestjs/graphql';
import { ExportType } from '../../prisma/generated/client.ts';

@InputType()
export class CreateExportInput {
  @Field(() => ID)
  reportId!: string;

  @Field(() => ExportType)
  exportType!: ExportType;
}
