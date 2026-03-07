import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthorAnalyticsEntity {
  @Field()
  authorId!: string;

  @Field(() => Int)
  totalReports!: number;

  @Field(() => Int)
  publishedReports!: number;

  @Field(() => Int)
  totalViews!: number;

  @Field(() => Float)
  avgReadDurationSeconds!: number;

  @Field(() => Int)
  totalReactions!: number;

  @Field(() => Int)
  totalComments!: number;

  @Field(() => Float)
  engagementRate!: number;
}
