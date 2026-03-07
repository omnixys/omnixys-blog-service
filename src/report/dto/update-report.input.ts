import { Field, ID, InputType } from '@nestjs/graphql';
import { Visibility } from '../../prisma/generated/client.ts';

@InputType()
export class UpdateReportInput {
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

  @Field({ nullable: true })
  changeSummary?: string;
}
