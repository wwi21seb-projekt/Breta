import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {NativeBaseProvider} from "native-base";

import AppTopBar from "./AppTopBar";
import TabBottomBar from "./TabBottomBar";

import Impressum from "../screens/Impressum";
import Authentification from "../screens/Authentification";
import ConfirmCode from "../screens/ConfirmCode";
import FollowerList from "../screens/FollowerList";
import FollowedList from "../screens/FollowedList";
import FriendRequest from "../screens/FriendRequest";
import { COLORS } from "../constants/theme";

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        header: () => <AppTopBar navigation={navigation} />
      })}
    >
      <Stack.Screen name="TabBottomBar" component={TabBottomBar} />
      <Stack.Screen name="Impressum" component={Impressum} />
      <Stack.Screen name="FollowerList" component={FollowerList} />
      <Stack.Screen name="FollowedList" component={FollowedList} />
      <Stack.Screen name="FriendRequest" component={FriendRequest} />
      <Stack.Screen
        name="Authentification"
        component={Authentification}
        options={{
          headerTitle: "Authentification",
          cardStyle: {
            backgroundColor: COLORS.white,
          },
    
        }}
      />
      <Stack.Screen
        name="ConfirmCode"
        component={ConfirmCode}
      />
    </Stack.Navigator>
    </NativeBaseProvider>
    </NavigationContainer>
  );

}
export default AppNavigator;

