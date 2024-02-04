import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { Role } from 'src/role/schema/role.schema';
import { FullSignUpInput } from 'src/auth/types';
import { UserDto, UserDtoWithRoles } from './types/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
  ) {}

  async getAll(): Promise<User[]> {
    return this.userModel
      .find()
      .populate({
        path: 'roles',
        model: 'Role',
        populate: { path: 'permissions', model: 'Permission' },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getById(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .populate({
        path: 'roles',
        model: 'Role',
        populate: { path: 'permissions', model: 'Permission' },
      })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.userModel
      .findOne({ email })
      .populate({
        path: 'roles',
        model: 'Role',
        populate: { path: 'permissions', model: 'Permission' },
      })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(data: FullSignUpInput): Promise<User> {
    const roles = await this.roleModel.find({
      name: { $in: data.roles || ['user'] },
    });
    if (roles.length === 0) {
      throw new Error('Specified roles do not exist.');
    }
    const user = new this.userModel({
      ...data,
      roles: roles.map((role) => role._id),
    });
    return user.save();
  }

  async getUserDtoById(id: string): Promise<UserDto> {
    const user = await this.userModel
      .findById(id)
      .populate({
        path: 'roles',
        model: 'Role',
        populate: { path: 'permissions', model: 'Permission' },
      })
      .exec();
    if (!user) {
      throw new Error('User not found');
    }
    return this.toUserDto(user);
  }

  private toUserDto(user: User): UserDtoWithRoles {
    const { id, firstName, lastName, email, roles } = user;
    return {
      id: id.toString(),
      firstName,
      lastName,
      email,
      roles:
        roles?.map((role) => ({
          id: role._id.toString(),
          name: role.name,
        })) || [],
    };
  }

  async updateToken(id: string, token: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .populate({
        path: 'roles',
        model: 'Role',
        populate: { path: 'permissions', model: 'Permission' },
      })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.token = token;
    return user.save();
  }

  async countDocuments(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }
}
