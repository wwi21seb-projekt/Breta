import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NativeBaseProvider } from "native-base";
import { navigationRef } from './NavigationService';

import AppTopBar from "./AppTopBar";
import TabBottomBar from "./TabBottomBar";

import Imprint from "../screens/ImprintScreen";
import Authentification from "../screens/AuthScreen";
import ConfirmCode from "../screens/ConfirmCodeScreen";
import FollowerList from "../screens/FollowerListScreen";
import GeneralProfile from "../screens/GeneralProfileScreen";
import EditProfile from "../screens/EditProfileScreen";

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {

  return (
  <NavigationContainer ref={navigationRef}>
      <NativeBaseProvider>
        <Stack.Navigator
          screenOptions={() => ({
            headerShown: true,
            header: () => <AppTopBar />,
          })}
        >
          <Stack.Screen name="TabBottomBar" component={TabBottomBar} />
          <Stack.Screen name="Imprint" component={Imprint} />
          <Stack.Screen name="FollowerList" component={FollowerList} />
          <Stack.Screen name="GeneralProfile" component={GeneralProfile} />
          <Stack.Screen name="Authentification" component={Authentification} />
          <Stack.Screen name="ConfirmCode" component={ConfirmCode} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
        </Stack.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  );
};
export default AppNavigator;
