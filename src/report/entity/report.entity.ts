import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { AuthorEntity } from '../../author/entity/author.entity.js';
import { JsonScalar } from '../../core/scalars/json.scalar.ts';
import { ReportStatus, Visibility } from '../../prisma/generated/client.js';

@ObjectType()
export class ReportEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  authorId!: string;

  @Field()
  title!: string;

  @Field()
  slug!: string;

  @Field(() => String, { nullable: true })
  excerpt?: string | null;

  @Field(() => String, { nullable: true })
  coverImageUrl?: string | null;

  @Field(() => JsonScalar)
  contentJson!: JsonScalar;

  @Field()
  contentText!: string;

  @Field(() => ReportStatus)
  status!: ReportStatus;

  @Field(() => Visibility)
  visibility!: Visibility;

  @Field(() => String, { nullable: true })
  categoryId?: string | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  publishedAt?: Date | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  scheduledAt?: Date | null;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field(() => AuthorEntity, { nullable: true })
  author?: AuthorEntity;

  //   @Field(() => CategoryEntity, { nullable: true })
  //   category?: CategoryEntity | null;

  //   @Field(() => [TagEntity], { nullable: true })
  //   tags?: TagEntity[];
}
