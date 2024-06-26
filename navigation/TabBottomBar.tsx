import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import stylePlusIcon from "../stylesheets/stylePlusIcon";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../theme";
import { useCheckAuthentication } from "../authentification/CheckAuthentification";

import Feed from "../screens/FeedScreen";
import Chat from "../screens/ChatScreen";
import Post from "../screens/PostScreen";
import Search from "../screens/SearchScreen";
import Profile from "../screens/ProfileScreen";
import LoginPopup from "../components/LoginPopup";

const Tabs = createBottomTabNavigator();

const TabBottomBar: React.FC = () => {
  const isAuthenticated = useCheckAuthentication();

  const getScreenComponent = (Component: any) => {
    return isAuthenticated ? Component : LoginPopup;
  };

  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={20}
              color={focused ? COLORS.primary : COLORS.black}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Chat"
        component={getScreenComponent(Chat)}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="chatbubble"
              size={20}
              color={focused ? COLORS.primary : COLORS.black}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Post"
        component={getScreenComponent(Post)}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View style={stylePlusIcon.addIcon}>
              <Ionicons
                name="add"
                size={20}
                color={focused ? COLORS.primary : COLORS.black}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="Search"
        component={getScreenComponent(Search)}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="search"
              size={20}
              color={focused ? COLORS.primary : COLORS.black}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={getScreenComponent(Profile)}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person"
              size={20}
              color={focused ? COLORS.primary : COLORS.black}
            />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default TabBottomBar;
