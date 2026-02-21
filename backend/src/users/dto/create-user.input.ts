import { InputType, Field, Int } from '@nestjs/graphql';
import { Role, EmployeeStatus } from '@prisma/client';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsInt } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @Field(() => Role)
  @IsEnum(Role)
  role: Role;

  @Field(() => EmployeeStatus)
  @IsEnum(EmployeeStatus)
  @IsOptional()
  status: EmployeeStatus;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  departmentId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  supervisorId?: number;
}
