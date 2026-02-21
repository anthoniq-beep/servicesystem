import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Department {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Int, { nullable: true })
  parentId?: number;

  @Field(() => Department, { nullable: true })
  parent?: Department;

  @Field(() => [Department], { nullable: true })
  children?: Department[];

  @Field(() => Int, { nullable: true })
  managerId?: number;

  @Field(() => User, { nullable: true })
  manager?: User;

  @Field(() => [User], { nullable: true })
  users?: User[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
