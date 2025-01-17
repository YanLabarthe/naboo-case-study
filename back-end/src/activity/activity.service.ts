import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity } from './schema/activity.schema';
import { CreateActivityInput } from './types';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name)
    private activityModel: Model<Activity>,
  ) {}

  async getAll(): Promise<Activity[]> {
    return this.activityModel
      .find()
      .sort({ createdAt: -1 })
      .populate('owner', 'firstName lastName email')
      .exec();
  }

  async findLatest(): Promise<Activity[]> {
    return this.activityModel
      .find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('owner', 'firstName lastName email')
      .exec();
  }

  async getByUser(userId: string): Promise<Activity[]> {
    return this.activityModel
      .find({ owner: userId })
      .sort({ createdAt: -1 })
      .populate('owner', 'firstName lastName email')
      .exec();
  }

  async getById(id: string): Promise<Activity> {
    const activity = await this.activityModel
      .findById(id)
      .populate('owner', 'firstName lastName email')
      .exec();
    if (!activity) throw new NotFoundException();
    return activity;
  }

  async create(userId: string, data: CreateActivityInput): Promise<Activity> {
    const activity = await this.activityModel.create({
      ...data,
      owner: userId,
    });
    return activity.populate('owner', 'firstName lastName email');
  }

  async findCities(): Promise<string[]> {
    return this.activityModel.distinct('city').exec();
  }

  async findByCity(
    city: string,
    activity?: string,
    price?: number,
  ): Promise<Activity[]> {
    return this.activityModel
      .find({
        $and: [
          { city },
          ...(price ? [{ price }] : []),
          ...(activity ? [{ name: { $regex: activity, $options: 'i' } }] : []),
        ],
      })
      .populate('owner', 'firstName lastName email')
      .exec();
  }

  async countDocuments(): Promise<number> {
    return this.activityModel.estimatedDocumentCount().exec();
  }
}
