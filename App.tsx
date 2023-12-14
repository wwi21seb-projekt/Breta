import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import FeedScreen from "./screens/FeedScreen";
import AuthScreen from "./screens/AuthScreen";
import { COLORS } from "./constants/theme";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Feed">
        <Stack.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            title: "",
            cardStyle: {
              backgroundColor: COLORS.white,
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{
            title: "",
            cardStyle: {
              backgroundColor: COLORS.white,
            },
            headerTransparent: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
