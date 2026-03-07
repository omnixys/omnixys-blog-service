import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthorEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  userId!: string;

  @Field()
  username!: string;

  @Field()
  displayName!: string;

  @Field(() => String, { nullable: true })
  bio?: string | null;

  @Field(() => String, { nullable: true })
  avatarUrl?: string | null;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
