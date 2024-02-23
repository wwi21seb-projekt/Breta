import {
  createNavigationContainerRef,
  StackActions,
} from "@react-navigation/native";

export type RootStackParamList = {
  Feed: undefined;
  Chat: undefined;
  ConfirmCode: undefined;
  Imprint: undefined;
  Authentification: undefined;
  Search: undefined;
  GeneralProfile: { username: string };
  FollowerList: { username: string };
  FollowingList: { username: string };
  EditProfile: { user: any };
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
export function navigate<RouteName extends keyof RootStackParamList>(
  screen: RouteName,
  params?: RootStackParamList[RouteName],
) {
  if (navigationRef.isReady()) {
    // @ts-ignore
    navigationRef.navigate(screen, params as any);
  }
}

export function reset<RouteName extends keyof RootStackParamList>(
  screen: RouteName,
) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: screen }],
    });
  }
}

export function push<RouteName extends keyof RootStackParamList>(
  screen: RouteName,
  params?: RootStackParamList[RouteName],
) {
  if (navigationRef.isReady()) {
    // @ts-ignore
    navigationRef.dispatch(StackActions.push(screen, params as any));
  }
}
