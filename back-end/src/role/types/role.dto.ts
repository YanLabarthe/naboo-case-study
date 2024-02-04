/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ObjectType } from '@nestjs/graphql';
import { PermissionDto } from 'src/permission/types';

@ObjectType()
export class RoleDto {
  @Field()
  id!: string;

  @Field()
  name!: string;
}

@ObjectType()
export class RoleDtoWithPermissions extends RoleDto {
  @Field((type) => [PermissionDto], { nullable: 'itemsAndList' })
  permissions?: PermissionDto[];
}
