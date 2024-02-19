import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NativeBaseProvider } from "native-base";
import { navigationRef } from "./NavigationService";
import { useCheckAuthentication } from "../authentification/CheckAuthentification";
import { View, ActivityIndicator } from "react-native";

import AppTopBar from "./AppTopBar";
import TabBottomBar from "./TabBottomBar";

import Imprint from "../screens/ImprintScreen";
import Authentification from "../screens/AuthScreen";
import ConfirmCode from "../screens/ConfirmCodeScreen";
import FollowerList from "../screens/FollowerListScreen";
import GeneralProfile from "../screens/GeneralProfileScreen";
import EditProfile from "../screens/EditProfileScreen";
import { useAuth } from "../authentification/AuthContext";

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const isAuthenticated = useCheckAuthentication();
  const { loading } = useAuth();
  if (loading) {
    return (
      <View className="bg-white flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  } else
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
            <Stack.Screen
              name="Authentification"
              component={Authentification}
            />
            <Stack.Screen name="ConfirmCode" component={ConfirmCode} />
            {isAuthenticated && (
              <>
                <Stack.Screen name="FollowerList" component={FollowerList} />
                <Stack.Screen
                  name="GeneralProfile"
                  component={GeneralProfile}
                />
                <Stack.Screen name="EditProfile" component={EditProfile} />
              </>
            )}
          </Stack.Navigator>
        </NativeBaseProvider>
      </NavigationContainer>
    );
};
export default AppNavigator;
