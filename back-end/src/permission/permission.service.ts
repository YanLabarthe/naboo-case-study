import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from './schema/permission.schema';
import { PermissionDto } from './types';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<Permission>,
  ) {}

  async getAll(): Promise<Permission[]> {
    return this.permissionModel.find().sort({ createdAt: -1 }).exec();
  }

  async getById(id: string): Promise<Permission> {
    const permission = await this.permissionModel.findById(id).exec();
    if (!permission) throw new NotFoundException();
    return permission;
  }

  async getByIds(ids: string[]): Promise<PermissionDto[]> {
    const permissions = await this.permissionModel
      .find({ _id: { $in: ids } })
      .exec();
    return permissions.map((permission) => ({
      id: permission._id.toString(),
      name: permission.name,
    }));
  }

  async getByName(name: string): Promise<Permission> {
    const permission = await this.permissionModel.findOne({ name }).exec();
    if (!permission) throw new NotFoundException();
    return permission;
  }

  async create(name: string): Promise<Permission> {
    const permission = await this.permissionModel.create({
      name,
    });
    return permission;
  }

  async countDocuments(): Promise<number> {
    return this.permissionModel.estimatedDocumentCount().exec();
  }
}
