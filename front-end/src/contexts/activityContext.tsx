import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { useQuery } from "@apollo/client";
import { GetActivitiesQuery, ActivityDto } from "@/graphql/generated/types";
import { useSnackbar } from "@/hooks";
import GetActivities from "@/graphql/queries/activity/getActivities";

type VisibilityState = {
  [Property in keyof ActivityDto]?: boolean;
};

interface ActivityContextType {
  activities: ActivityDto[];
  setActivities: Dispatch<SetStateAction<ActivityDto[]>>;
  isLoading: boolean;
  visibilityState: VisibilityState;
  toggleVisibility: (field: keyof ActivityDto) => void;
}

const defaultVisibilityState: VisibilityState = {
  city: true,
  description: true,
  name: true,
  price: true,
  createdAt: false,
  updatedAt: false,
};

const defaultContextValue: ActivityContextType = {
  activities: [],
  setActivities: () => {},
  isLoading: false,
  visibilityState: defaultVisibilityState,
  toggleVisibility: () => {},
};

export const ActivityContext =
  createContext<ActivityContextType>(defaultContextValue);

export function useActivities(): ActivityContextType {
  return useContext(ActivityContext);
}

interface ActivityProviderProps {
  children: ReactNode;
}

export const ActivityProvider: React.FC<ActivityProviderProps> = ({
  children,
}) => {
  const snackbar = useSnackbar();
  const [activities, setActivities] = useState<ActivityDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [visibilityState, setVisibilityState] = useState<VisibilityState>(
    defaultVisibilityState
  );

  const { data, loading, error } = useQuery<GetActivitiesQuery>(GetActivities, {
    onCompleted: (data) => {
      setActivities(data.getActivities as ActivityDto[]);
      setIsLoading(false);
    },
    onError: (error) => {
      snackbar.error(error.message);
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (data && data.getActivities) {
      setActivities(data.getActivities as ActivityDto[]);
    }
    setIsLoading(loading);
  }, [data, loading]);

  const toggleVisibility = (field: keyof ActivityDto) => {
    setVisibilityState((prevState) => {
      const newState = { ...prevState, [field]: !prevState[field] };
      return newState;
    });
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        setActivities,
        isLoading,
        visibilityState,
        toggleVisibility,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};
