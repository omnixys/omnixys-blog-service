import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { SyncStatus } from '../../prisma/generated/client.ts';

@ObjectType()
export class DraftSyncStateEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  reportId!: string;

  @Field()
  authorId!: string;

  @Field(() => Int)
  localVersion!: number;

  @Field(() => Int)
  serverVersion!: number;

  @Field({ nullable: true })
  lastSyncedAt?: Date | null;

  @Field(() => SyncStatus)
  syncStatus!: SyncStatus;

  @Field({ nullable: true })
  conflictState?: string | null;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
