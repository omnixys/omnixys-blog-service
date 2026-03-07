import { Field, InputType } from '@nestjs/graphql';
import { Visibility } from '../../prisma/generated/client.ts';

@InputType()
export class CreateReportInput {
  @Field()
  title!: string;

  @Field({ nullable: true })
  excerpt?: string;

  @Field({ nullable: true })
  coverImageUrl?: string;

  @Field()
  contentJson!: string;

  @Field()
  contentText!: string;

  @Field(() => Visibility, { defaultValue: Visibility.PRIVATE })
  visibility!: Visibility;

  @Field({ nullable: true })
  categoryId?: string;

  @Field(() => [String], { defaultValue: [] })
  tagNames!: string[];
}
