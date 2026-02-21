import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Role, EmployeeStatus } from '@prisma/client';

registerEnumType(Role, { name: 'Role' });
registerEnumType(EmployeeStatus, { name: 'EmployeeStatus' });

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  username: string;

  @Field()
  name: string;

  @Field()
  phone: string;

  @Field(() => Role)
  role: Role;

  @Field(() => EmployeeStatus)
  status: EmployeeStatus;

  @Field(() => Int, { nullable: true })
  departmentId?: number | null;

  @Field(() => Int, { nullable: true })
  supervisorId?: number | null;
}
