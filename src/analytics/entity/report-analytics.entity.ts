import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReportAnalyticsEntity {
  @Field()
  reportId!: string;

  @Field(() => Int)
  views!: number;

  @Field(() => Int)
  uniqueReaders!: number;

  @Field(() => Float)
  avgReadDurationSeconds!: number;

  @Field(() => Int)
  reactions!: number;

  @Field(() => Int)
  comments!: number;

  @Field(() => Float)
  engagementRate!: number;
}
