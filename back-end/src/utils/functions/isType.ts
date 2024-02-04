import { Activity } from 'src/activity/schema/activity.schema';
import { Permission } from 'src/permission/schema/permission.schema';
import { Role } from 'src/role/schema/role.schema';

export function isActivity(object: any): object is Activity {
  return object && typeof object === 'object' && 'name' in object;
}

export function isPermission(object: any): object is Permission {
  return object && typeof object === 'object' && 'name' in object;
}

export function isRole(roleOrId: any): roleOrId is Role {
  return (roleOrId as Role).name !== undefined;
}
