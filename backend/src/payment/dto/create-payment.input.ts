import { InputType, Int, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreatePaymentInput {
  @Field(() => Int)
  contractId: number;

  @Field(() => Float)
  amount: number;

  @Field()
  paidAt: string; // ISO Date String

  @Field(() => Int)
  recorderId: number;
}
