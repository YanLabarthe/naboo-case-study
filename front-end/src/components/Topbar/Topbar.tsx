import { useAuth } from "@/hooks";
import {
  Container,
  Group,
  Header,
  Button,
  Checkbox,
  Popover,
} from "@mantine/core";
import Link from "next/link";
import { MenuItem } from "./MenuItem";
import { useTopbarStyles } from "./Topbar.styles";
import { getFilteredRoutes } from "./getFilteredRoutes";
import { Route } from "./types";
import { useActivities } from "@/contexts/activityContext";
import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";

interface TopbarProps {
  routes: Route[];
}

export function Topbar({ routes }: TopbarProps) {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const { classes } = useTopbarStyles();
  const { user, hasRole } = useAuth();
  const { visibilityState, toggleVisibility } = useActivities();
  const filteredRoutes = getFilteredRoutes(routes, user);

  const handleToggleVisibility = (field: keyof typeof visibilityState) => {
    toggleVisibility(field);
  };

  return (
    <Header height={56} className={classes.header}>
      <Container>
        <div className={classes.inner}>
          <Link href="/" className={classes.mainLink}>
            <h1 className={classes.title}>Candidator</h1>
          </Link>
          <Group spacing={5} className={classes.links}>
            {filteredRoutes.map((route) => (
              <MenuItem key={route.label} {...route} />
            ))}
            {hasRole("admin") && (
              <Popover
                opened={popoverOpened}
                onClose={() => setPopoverOpened(false)}
                position="bottom"
                withArrow
                width={200}
              >
                <Popover.Target>
                  <Button
                    rightIcon={<IconChevronDown size={14} />}
                    color="orange"
                    onClick={() => setPopoverOpened((o) => !o)}
                  >
                    Debug Mode
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  {Object.keys(visibilityState).map((field) => (
                    <Checkbox
                      key={field}
                      label={field}
                      checked={
                        !!visibilityState[field as keyof typeof visibilityState]
                      }
                      onChange={() =>
                        handleToggleVisibility(
                          field as keyof typeof visibilityState
                        )
                      }
                    />
                  ))}
                </Popover.Dropdown>
              </Popover>
            )}
          </Group>
        </div>
      </Container>
    </Header>
  );
}
