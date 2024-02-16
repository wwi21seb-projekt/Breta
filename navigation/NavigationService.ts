import { createNavigationContainerRef } from "@react-navigation/native";

export type RootStackParamList = {
  Feed: undefined;
  Chat: undefined;
  ConfirmCode: undefined;
  Imprint: undefined;
  Authentification: undefined;
  Search: undefined;
  GeneralProfile: undefined;
  FollowerList: undefined;
  FollowedList: undefined;
  FriendRequest: undefined;
  EditProfile: undefined;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
export function navigate<RouteName extends keyof RootStackParamList>(
  screen: RouteName,
  params?: RootStackParamList[RouteName],
) {
  if (navigationRef.isReady()) {
    // @ts-ignore
    navigationRef.navigate(screen, params);
  }
}
