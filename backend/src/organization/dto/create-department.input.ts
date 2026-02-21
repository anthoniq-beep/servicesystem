import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateDepartmentInput {
  @Field()
  name: string;

  @Field(() => Int, { nullable: true })
  parentId?: number;

  @Field(() => Int, { nullable: true })
  managerId?: number;
}
