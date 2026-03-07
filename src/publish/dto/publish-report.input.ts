import { Field, ID, InputType } from '@nestjs/graphql';
import { Visibility } from '../../prisma/generated/client.ts';

@InputType()
export class PublishReportInput {
  @Field(() => ID)
  reportId!: string;

  @Field(() => Visibility, { nullable: true })
  visibility?: Visibility;
}
