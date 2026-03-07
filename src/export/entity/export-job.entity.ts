import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { ExportJobStatus, ExportType } from '../../prisma/generated/client.ts';

@ObjectType()
export class ExportJobEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  reportId!: string;

  @Field()
  authorId!: string;

  @Field(() => ExportType)
  exportType!: ExportType;

  @Field(() => String, { nullable: true })
  storageKey?: string | null;

  @Field(() => ExportJobStatus)
  status!: ExportJobStatus;

  @Field()
  createdAt!: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  completedAt?: Date | null;
}
