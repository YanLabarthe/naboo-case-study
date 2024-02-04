import { Injectable } from '@nestjs/common';
import { Mapper } from 'src/utils/mapper';
import { Permission } from '../schema/permission.schema';
import { PermissionDto } from '../types';

@Injectable()
export class PermissionMapper implements Mapper<Permission, PermissionDto> {
  async convert(permission: Permission): Promise<PermissionDto> {
    return {
      id: permission._id.toString(),
      name: permission.name,
    };
  }
}
