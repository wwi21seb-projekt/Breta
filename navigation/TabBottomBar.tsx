import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "native-base";
import { View } from "react-native";
import stylePlusIcon from "../stylesheets/stylePlusIcon";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme";

import Feed from "../screens/FeedScreen";
import Chat from "../screens/ChatScreen";
import Post from "../screens/PostScreen";
import Search from "../screens/SearchScreen";
import Profile from "../screens/ProfileScreen";

const Tabs = createBottomTabNavigator();

const TabBottomBar: React.FC = () => {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Icon
              as={Ionicons}
              name="home"
              size="md"
              color={focused ? COLORS.primary : COLORS.black}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Icon
              as={Ionicons}
              name="chatbubble"
              size="md"
              color={focused ? COLORS.primary : COLORS.black}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Post"
        component={Post}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View style={stylePlusIcon.addIcon}>
              <Icon
                as={Ionicons}
                name="add"
                size="md"
                color={focused ? COLORS.primary : COLORS.black}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="Search"
        component={Search}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Icon
              as={Ionicons}
              name="search"
              size="md"
              color={focused ? COLORS.primary : COLORS.black}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Icon
              as={Ionicons}
              name="person"
              size="md"
              color={focused ? COLORS.primary : COLORS.black}
            />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default TabBottomBar;
