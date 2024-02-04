import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FavoriteService } from '../favorite.service';
import { CreateFavoriteInput } from '../types';
import { ActivityDto } from 'src/activity/types';
import { ActivityMapper } from 'src/activity/mapper/activity.mapper';
import { isActivity } from 'src/utils/functions/isType';

@Resolver('Favorite')
export class FavoriteResolver {
  constructor(
    private readonly favoriteService: FavoriteService,
    private readonly activityMapper: ActivityMapper,
  ) {}

  @Mutation(() => Boolean)
  async toggleFavorite(
    @Args('createFavoriteInput') createFavoriteInput: CreateFavoriteInput,
  ): Promise<boolean> {
    const { userId, activityId } = createFavoriteInput;
    return this.favoriteService.toggleFavorite(userId, activityId);
  }

  @Query(() => [ActivityDto])
  async GetUserFavoriteActivities(
    @Args('userId', { type: () => String }) userId: string,
  ): Promise<ActivityDto[]> {
    const favorites = await this.favoriteService.getUserFavorites(userId);
    const activityDtos = await Promise.all(
      favorites
        .map(async (favorite) => {
          if (isActivity(favorite.activity)) {
            return await this.activityMapper.convert(favorite.activity);
          }
          return null;
        })
        .filter((activityDto) => activityDto !== null),
    );

    return activityDtos as ActivityDto[];
  }
}
