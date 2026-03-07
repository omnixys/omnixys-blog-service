import { Field, ID, InputType } from '@nestjs/graphql';
import { Visibility } from '../../prisma/generated/client.ts';

@InputType()
export class ScheduleReportInput {
  @Field(() => ID)
  reportId!: string;

  @Field()
  scheduledAt!: Date;

  @Field(() => Visibility, { nullable: true })
  visibility?: Visibility;
}
