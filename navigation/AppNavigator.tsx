import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NativeBaseProvider } from "native-base";

import AppTopBar from "./AppTopBar";
import TabBottomBar from "./TabBottomBar";

import Impressum from "../screens/Impressum";
import Authentification from "../screens/AuthScreen";
import ConfirmCode from "../screens/ConfirmCode";
import FollowerList from "../screens/FollowerListScreen";
import GeneralProfile from "../screens/GeneralProfileScreen";
import EditProfile from "../screens/EditProfileScreen";
import Error from "../screens/ErrorScreen";

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <Stack.Navigator
          screenOptions={({ navigation }) => ({
            headerShown: true,
            header: () => <AppTopBar navigation={navigation} />,
          })}
        >
          <Stack.Screen name="TabBottomBar" component={TabBottomBar} />
          <Stack.Screen name="Impressum" component={Impressum} />
          <Stack.Screen name="FollowerList" component={FollowerList} />
          <Stack.Screen name="GeneralProfile" component={GeneralProfile} />
          <Stack.Screen name="Authentification" component={Authentification} />
          <Stack.Screen name="ConfirmCode" component={ConfirmCode} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="Error" component={Error} />
        </Stack.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  );
};
export default AppNavigator;
