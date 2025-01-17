import { Injectable } from '@nestjs/common';
import { Mapper } from 'src/utils/mapper';
import { Favorite } from '../schema/favorite.schema';
import { FavoriteDto } from '../types';

@Injectable()
export class FavoriteMapper implements Mapper<Favorite, FavoriteDto> {
  async convert(favorite: Favorite): Promise<FavoriteDto> {
    return {
      id: favorite.id,
      userId: favorite.user.toString(),
      activityId: favorite.activity.toString(),
    };
  }
}
