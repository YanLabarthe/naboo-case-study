import { useActivities } from "@/contexts/activityContext";
import { useFavorites } from "@/contexts/favoriteContext";
import { ActivityFragment } from "@/graphql/generated/types";
import { useAuth } from "@/hooks";
import { useGlobalStyles } from "@/utils";
import { formatDate } from "@/utils/formatDate";
import { Badge, Button, Card, Grid, Group, Image, Text } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";

import Link from "next/link";

interface ActivityProps {
  activity: ActivityFragment;
}

export function Activity({ activity }: ActivityProps) {
  const { favorites, handleToggleFavorite } = useFavorites();
  const { user } = useAuth();
  const { visibilityState } = useActivities();

  const isFavorite =
    Array.isArray(favorites) && favorites.some((fav) => fav.id === activity.id);

  const { classes } = useGlobalStyles();

  return (
    <Grid.Col span={4}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section position="relative">
          <Image
            src="https://source.unsplash.com/random/?city"
            height={160}
            alt="random image of city"
          />
          {user && (
            <Button
              onClick={() =>
                handleToggleFavorite(activity.id, {
                  name: activity.name,
                  city: activity.city,
                  description: activity.description,
                  price: activity.price,
                  owner: activity.owner,
                })
              }
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "none",
                border: "none",
                padding: 0,
              }}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              {isFavorite ? (
                <IconHeart
                  color="red"
                  size={30}
                  stroke={2}
                  strokeLinejoin="miter"
                  fill="red"
                />
              ) : (
                <IconHeart
                  color="red"
                  size={30}
                  stroke={1.8}
                  strokeLinejoin="miter"
                />
              )}
            </Button>
          )}
        </Card.Section>

        {visibilityState?.name && (
          <Group position="apart" mt="md" mb="xs">
            <Text weight={500} className={classes.ellipsis}>
              {activity.name}
            </Text>
          </Group>
        )}

        <Group mt="md" mb="xs">
          {visibilityState?.city && (
            <Badge color="pink" variant="light">
              {activity.city}
            </Badge>
          )}
          {visibilityState?.price && (
            <Badge color="yellow" variant="light">
              {`${activity.price}€/j`}
            </Badge>
          )}
        </Group>
        {visibilityState?.description && (
          <Text size="sm" color="dimmed" className={classes.ellipsis}>
            {activity.description}
          </Text>
        )}
        {visibilityState?.createdAt && (
          <Text size="sm" color="orange" className={classes.ellipsis}>
            createdAt : {formatDate(activity.createdAt)}
          </Text>
        )}

        {visibilityState?.updatedAt && (
          <Text size="sm" color="red" className={classes.ellipsis}>
            updatedAt : {formatDate(activity.updatedAt)}
          </Text>
        )}

        <Link href={`/activities/${activity.id}`} className={classes.link}>
          <Button variant="light" color="blue" fullWidth mt="md" radius="md">
            Voir plus
          </Button>
        </Link>
      </Card>
    </Grid.Col>
  );
}
