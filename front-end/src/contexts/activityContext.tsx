import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { useQuery } from "@apollo/client";
import { GetActivitiesQuery, ActivityDto } from "@/graphql/generated/types";
import { useAuth, useSnackbar } from "@/hooks";
import GetActivities from "@/graphql/queries/activity/getActivities";

type VisibilityState = {
  [Property in keyof ActivityDto]?: boolean;
};

interface ActivityContextType {
  activities: ActivityDto[];
  setActivities: Dispatch<SetStateAction<ActivityDto[]>>;
  isLoading: boolean;
  visibilityState: VisibilityState;
  setVisibilityState: Dispatch<SetStateAction<VisibilityState>>;
  toggleVisibility: (field: keyof ActivityDto) => void;
}

export const defaultVisibilityState: VisibilityState = {
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
  setVisibilityState: () => {},
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
  const [isLocalStorageLoaded, setIsLocalStorageLoaded] =
    useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedVisibilityState = localStorage.getItem("visibilityState");
      if (savedVisibilityState) {
        setVisibilityState(JSON.parse(savedVisibilityState));
      }
      setIsLocalStorageLoaded(true);
    }
  }, []);

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
    if (isLocalStorageLoaded) {
      localStorage.setItem("visibilityState", JSON.stringify(visibilityState));
    }
  }, [visibilityState, isLocalStorageLoaded]);

  const toggleVisibility = (field: keyof ActivityDto) => {
    setVisibilityState((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  if (!isLocalStorageLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <ActivityContext.Provider
      value={{
        activities,
        setActivities,
        isLoading,
        visibilityState,
        setVisibilityState,
        toggleVisibility,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};
