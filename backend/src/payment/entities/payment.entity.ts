import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Payment {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  contractId: number;

  @Field(() => Float)
  amount: number;

  @Field()
  paidAt: Date;

  @Field(() => Int)
  recorderId: number;

  @Field()
  isApproved: boolean;

  @Field({ nullable: true })
  approvedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
