import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateSalesTargetInput {
  @Field(() => Int)
  userId: number;

  @Field()
  month: string;

  @Field(() => Float)
  amount: number;
}
