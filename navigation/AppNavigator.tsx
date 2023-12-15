import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  VStack,
  HStack,
  Button,
  IconButton,
  Icon,
  Text,
  NativeBaseProvider,
  Center,
  Box,
  StatusBar,
} from "native-base";

import { StyleSheet, View, Platform } from "react-native";

import TabBarIcon from "../components/TabBarIcon";
import TabBarText from "../components/TabBarText";

import Chat from "../screens/Chat";
import Post from "../screens/Post";
import Profile from "../screens/Profile";
import Search from "../screens/Search";

import AppTopBar from "./AppTopBar";

import FeedScreen from "../screens/FeedScreen";
import AuthScreen from "../screens/AuthScreen";
import ConfirmCode from "../screens/ConfirmCode";
import { COLORS } from "../constants/theme";
import Feed from "../screens/Feed";
import Impressum from "../components/Impressum";

const MainStack = createNativeStackNavigator();

const Main: React.FC = () => {
  return (
    <MainStack.Navigator
      screenOptions={{ headerShown: true, header: () => <AppTopBar /> }}
    >
      <MainStack.Screen name="TopBar" component={MainTabs} />
      <MainStack.Screen
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
      <MainStack.Screen name="Impressum" component={Impressum} />
      <MainStack.Screen
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
      <MainStack.Screen
        name="CodePage"
        component={ConfirmCode}
        options={{ headerShown: false }}
      />
    </MainStack.Navigator>
  );
};

const Tabs = createBottomTabNavigator();

const MainTabs: React.FC = () => {
  return (
    <>
      <Tabs.Navigator screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="Feed"
          component={FeedScreen}
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
    </>
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

export default () => {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <Main />
      </NativeBaseProvider>
    </NavigationContainer>
  );
};
