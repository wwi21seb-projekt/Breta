import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "native-base";
import { View } from "react-native";
import stylePlusIcon from "../stylesheets/stylePlusIcon";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme";

import Feed from "../screens/Feed";
import Chat from "../screens/Chat";
import Post from "../screens/Post";
import Search from "../screens/Search";
import Profile from "../screens/Profile";

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
        listeners={({ navigation }) =>
          ({
            tabPress: (e) => {
              e.preventDefault()
              navigation.navigate('PostPage' as never)
            }
          })}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="" />
          ),
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
