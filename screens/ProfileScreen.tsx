import UserProfile from "../components/UserProfile";
import React, { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { User } from "../components/types/User";
import { loadUser } from "../components/functions/LoadUser";
import { useAuth } from "../authentification/AuthContext";
import ErrorComp from "../components/ErrorComp";
import { useFocusEffect } from "@react-navigation/native";

const ProfileScreen = () => {
  const { user, token } = useAuth();
  const [userInfo, setUserInfo] = useState<User>();
  const [errorText, setErrorText] = useState("");

  // Load user info when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (user && token) {
        loadUser(user, setUserInfo, setErrorText, token);
      }
    }, [user, token]),
  );

  // Render error component if there's an error
  if (errorText) {
    return <ErrorComp errorText={errorText} />;
  } else if (userInfo !== undefined) {
    // Render user profile if user info is loaded
    return <UserProfile personal={true} userInfo={userInfo} />;
  } else {
    // Render loading indicator while loading user info
    return (
      <View className="bg-white flex-1 justify-center items-center">
         <ActivityIndicator size="large" />
      </View>
    );
  }
};

export default ProfileScreen;
