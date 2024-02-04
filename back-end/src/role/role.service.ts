import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role } from './schema/role.schema';
import { PermissionDto } from 'src/permission/types';
import { Permission } from 'src/permission/schema/permission.schema';
import { PermissionMapper } from 'src/permission/mapper/permission.mapper';
import { RoleDto } from './types';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
    @InjectModel(Permission.name)
    private permissionModel: Model<Permission>,
    private permissionMapper: PermissionMapper,
  ) {}

  async getAll(): Promise<Role[]> {
    return this.roleModel
      .find()
      .populate({ path: 'permissions', model: 'Permission' })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getById(id: string): Promise<Role> {
    const role = await this.roleModel
      .findById(id)
      .populate({ path: 'permissions', model: 'Permission' })
      .exec();

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async getByIds(ids: string[]): Promise<RoleDto[]> {
    const roles = await this.roleModel
      .find({ _id: { $in: ids } })
      .populate({ path: 'permissions', model: 'Permission' })
      .exec();
    return roles.map((role) => this.toRoleDto(role));
  }

  private toRoleDto(role: Role): RoleDto {
    return {
      id: role._id.toString(),
      name: role.name,
    };
  }

  async getByName(name: string): Promise<Role> {
    const role = await this.roleModel
      .findOne({ name })
      .populate({ path: 'permissions', model: 'Permission' })
      .exec();
    if (!role) {
      throw new NotFoundException(`Role with name '${name}' not found`);
    }
    return role;
  }

  async fetchAndConvertPermission(
    permissionId: Types.ObjectId,
  ): Promise<PermissionDto> {
    const permission = await this.permissionModel
      .findById(permissionId)
      .populate({ path: 'permissions', model: 'Permission' })
      .exec();
    if (!permission) {
      throw new NotFoundException(
        `Permission with ID ${permissionId} not found`,
      );
    }
    return this.permissionMapper.convert(permission);
  }

  async create(name: string, permissions: Types.ObjectId[]): Promise<Role> {
    const role = new this.roleModel({
      name,
      permissions,
    });
    await role.save();
    return role;
  }

  async countDocuments(): Promise<number> {
    return this.roleModel.estimatedDocumentCount().exec();
  }
}
