import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class SearchReportsArgs {
  @Field()
  query!: string;

  @Field(() => Int, { defaultValue: 20 })
  limit!: number;

  @Field(() => Int, { defaultValue: 0 })
  offset!: number;
}
