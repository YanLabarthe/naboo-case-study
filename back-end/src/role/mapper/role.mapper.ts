import { Injectable } from '@nestjs/common';
import { Role } from '../schema/role.schema';
import { RoleDto, RoleDtoWithPermissions } from '../types';
import { PermissionService } from 'src/permission/permission.service';
import { Mapper } from 'src/utils/mapper';

@Injectable()
export class RoleMapper implements Mapper<Role, RoleDtoWithPermissions> {
  constructor(private readonly permissionService: PermissionService) {}

  async convert(role: Role): Promise<RoleDto | RoleDtoWithPermissions> {
    const basicRoleDto: RoleDto = {
      id: role._id.toString(),
      name: role.name,
    };

    if (!role.permissions || role.permissions.length === 0) {
      return basicRoleDto;
    }

    const permissionIds = role.permissions.map((permission) =>
      permission._id.toString(),
    );
    const permissionsDto = await this.permissionService.getByIds(permissionIds);

    return {
      ...basicRoleDto,
      permissions: permissionsDto,
    };
  }
}
