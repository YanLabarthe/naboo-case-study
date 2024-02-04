import { Injectable } from '@nestjs/common';
import { UserMapper } from 'src/user/mapper/user.mapper';
import { ActivityDto } from '../types';
import { Activity } from '../schema/activity.schema';

@Injectable()
export class ActivityMapper {
  constructor(private readonly userMapper: UserMapper) {}

  async convert(activity: Activity): Promise<ActivityDto> {
    if (!activity.owner || typeof activity.owner === 'string') {
      throw new Error('Owner is not populated');
    }

    const ownerDto = await this.userMapper.convert(activity.owner);

    return {
      id: activity._id.toString(),
      name: activity.name,
      city: activity.city,
      description: activity.description,
      price: activity.price,
      owner: ownerDto,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
    };
  }
}
