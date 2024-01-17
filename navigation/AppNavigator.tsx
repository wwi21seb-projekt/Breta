import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NativeBaseProvider } from "native-base";

import AppTopBar from "./AppTopBar";
import TabBottomBar from "./TabBottomBar";

import Impressum from "../screens/Impressum";
import Authentification from "../screens/AuthScreen";
import ConfirmCode from "../screens/ConfirmCode";
import UserList from "../screens/UserList";
import FollowerProfile from "../screens/FollowerProfile";
import EditProfile from "../screens/EditProfileScreen";

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
          <Stack.Screen name="UserList" component={UserList} />
          <Stack.Screen name="FollowerProfile" component={FollowerProfile} />
          <Stack.Screen name="Authentification" component={Authentification} />
          <Stack.Screen name="ConfirmCode" component={ConfirmCode} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
        </Stack.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  );
};
export default AppNavigator;
