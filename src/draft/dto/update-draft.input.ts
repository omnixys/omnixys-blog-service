import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { SyncStatus, Visibility } from '../../prisma/generated/client.js';

@InputType()
export class UpdateDraftInput {
  @Field(() => ID)
  reportId!: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  excerpt?: string;

  @Field({ nullable: true })
  coverImageUrl?: string;

  @Field({ nullable: true })
  contentJson?: string;

  @Field({ nullable: true })
  contentText?: string;

  @Field(() => Visibility, { nullable: true })
  visibility?: Visibility;

  @Field({ nullable: true })
  categoryId?: string;

  @Field(() => [String], { nullable: true })
  tagNames?: string[];

  @Field(() => Int)
  localVersion!: number;

  @Field(() => SyncStatus)
  syncStatus!: SyncStatus;

  @Field({ nullable: true })
  changeSummary?: string;
}
