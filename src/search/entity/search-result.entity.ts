import { Field, ObjectType } from '@nestjs/graphql';
import { ReportEntity } from '../../report/entity/report.entity.js';

@ObjectType()
export class SearchResultEntity {
  @Field(() => [ReportEntity])
  items!: ReportEntity[];

  @Field()
  total!: number;
}
