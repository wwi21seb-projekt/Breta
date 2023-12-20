import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/TabBarIcon";
import TabBarText from "../components/TabBarText";
import { StyleSheet, View, Platform } from "react-native";

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
            tabBarLabel: ({ focused }) => (
              <TabBarText focused={focused} title="" />
            ),
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                icon={"home"}
                color={"black"}
                style={{ marginRight: 10 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Chat"
          component={Chat}
          options={{
            tabBarLabel: ({ focused }) => (
              <TabBarText focused={focused} title="" />
            ),
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                icon={"chatbubble"}
                color={"black"}
                style={{ marginRight: 10 }}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="Post"
          component={Post}
          options={{
            tabBarLabel: ({ focused }) => (
              <TabBarText focused={focused} title="" />
            ),

            tabBarIcon: ({ focused }) => (
              <View style={styles.addIcon}>
                <TabBarIcon
                  focused={focused}
                  icon={"add"}
                  color={"black"}
                  style={styles.addIconPlus}
                />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="Search"
          component={Search}
          options={{
            tabBarLabel: ({ focused }) => (
              <TabBarText focused={focused} title="" />
            ),

            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                icon={"search"}
                color={"black"}
                style={{ marginRight: 10, fontWeight: 600 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: ({ focused }) => (
              <TabBarText focused={focused} title="" />
            ),
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                icon={"person"}
                color={"black"}
                style={{ marginRight: 10 }}
              />
            ),
          }}
        />
      </Tabs.Navigator>
  );
};

const styles = StyleSheet.create({
  addIcon: {
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    color: "black",
    marginBottom: 25,
    width: 55,
    height: 55,
    borderRadius: 50,
    shadowRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },

  addIconPlus: {
    fontSize: 32,
    fontWeight: "700",
  },
});

export default TabBottomBar;
