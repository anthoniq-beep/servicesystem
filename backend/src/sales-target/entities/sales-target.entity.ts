import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class SalesTarget {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => User)
  user: User;

  @Field()
  month: string;

  @Field(() => Float)
  amount: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
