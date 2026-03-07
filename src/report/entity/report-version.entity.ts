import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReportVersionEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  reportId!: string;

  @Field(() => Int)
  versionNumber!: number;

  @Field()
  title!: string;

  @Field()
  contentJson!: string;

  @Field()
  contentText!: string;

  @Field({ nullable: true })
  changeSummary?: string | null;

  @Field()
  createdBy!: string;

  @Field()
  createdAt!: Date;
}
