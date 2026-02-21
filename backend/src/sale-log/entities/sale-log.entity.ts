import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class SaleLog {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
