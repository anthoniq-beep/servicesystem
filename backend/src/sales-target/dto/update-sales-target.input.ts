import { CreateSalesTargetInput } from './create-sales-target.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSalesTargetInput extends PartialType(CreateSalesTargetInput) {
  @Field(() => Int)
  id: number;
}
