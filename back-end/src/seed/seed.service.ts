import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ActivityService } from '../activity/activity.service';
import { UserService } from '../user/user.service';
import { activities as activitiesData } from './activity.data';
import { users as usersData } from './user.data';
import { RoleService } from '../role/role.service';
import { roles as rolesData } from './role.data';
import { permissions as permissionsData } from './permission.data';
import { PermissionService } from 'src/permission/permission.service';

@Injectable()
export class SeedService {
  constructor(
    private userService: UserService,
    private activityService: ActivityService,
    private roleService: RoleService,
    private permissionService: PermissionService,
  ) {}

  async execute(): Promise<void> {
    const users = await this.userService.countDocuments();
    const activities = await this.activityService.countDocuments();
    const roles = await this.activityService.countDocuments();
    const permissions = await this.permissionService.countDocuments();
    let createdPermissions: any[] = [];

    if (permissions === 0) {
      createdPermissions = await Promise.all(
        permissionsData.map((permission) =>
          this.permissionService.create(permission.name),
        ),
      );
    }

    if (roles === 0) {
      const permissionsMap = createdPermissions.reduce((acc, permission) => {
        acc[permission.name] = permission._id;
        return acc;
      }, {});

      const adminPermissions = Object.values(permissionsMap);
      const userPermissions = [
        permissionsMap['get_activity'],
        permissionsMap['get_own_activity'],
      ];

      await Promise.all(
        rolesData.map(async (roleData) => {
          const permissions =
            roleData.name === 'admin'
              ? adminPermissions
              : roleData.name === 'user'
              ? userPermissions
              : [];
          return this.roleService.create(roleData.name, permissions);
        }),
      );
    }

    if (users === 0 && activities === 0) {
      try {
        const createdUsers = await Promise.all(
          usersData.map(async (user) => {
            return await this.userService.createUser({
              ...user,
              password: await bcrypt.hash(user.password, 10),
            });
          }),
        );

        await Promise.all(
          activitiesData.map((activity) =>
            createdUsers.map((user) =>
              this.activityService.create(user._id, activity),
            ),
          ),
        );
        Logger.log('Seeding successful!');
      } catch (error) {
        Logger.error(error);
        throw error;
      }
    }
  }
}
