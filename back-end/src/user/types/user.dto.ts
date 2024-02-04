/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ObjectType } from '@nestjs/graphql';
import { RoleDto, RoleDtoWithPermissions } from 'src/role/types';

@ObjectType()
export class UserDto {
  @Field()
  id!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  email!: string;
}
@ObjectType()
export class UserDtoWithRoles extends UserDto {
  @Field((type) => [RoleDto], { nullable: 'itemsAndList' })
  roles?: RoleDto[];
}

@ObjectType()
export class UserDtoWithRolesAndPermissions extends UserDto {
  @Field((type) => [RoleDtoWithPermissions], { nullable: 'itemsAndList' })
  roles?: RoleDtoWithPermissions[];
}
