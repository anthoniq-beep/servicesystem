import { CreateSaleLogInput } from './create-sale-log.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSaleLogInput extends PartialType(CreateSaleLogInput) {
  @Field(() => Int)
  id: number;
}
