import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMapper } from './mapper/user.mapper';
import { User, UserSchema } from './schema/user.schema';
import { UserService } from './user.service';
import { UserResolver } from './resolver/user.resolver';
import { JwtService } from '@nestjs/jwt';
import { RoleModule } from 'src/role/role.module';
import { ActivityModule } from 'src/activity/activity.module';
import { Activity, ActivitySchema } from 'src/activity/schema/activity.schema';
import { Role, RoleSchema } from 'src/role/schema/role.schema';
import {
  Permission,
  PermissionSchema,
} from 'src/permission/schema/permission.schema';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
    forwardRef(() => RoleModule),
    forwardRef(() => ActivityModule),
    forwardRef(() => PermissionModule),
  ],
  exports: [UserService, UserMapper],
  providers: [JwtService, UserService, UserMapper, UserResolver],
})
export class UserModule {}
