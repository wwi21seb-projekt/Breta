import UserProfile from "../components/UserProfile";
import React, { useState } from "react";
import { User } from "../components/types/User";
import { View, ActivityIndicator } from "react-native";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { loadUser } from "../components/functions/LoadUser";
import { useAuth } from "../authentification/AuthContext";
import ErrorComp from "../components/ErrorComp";

type RouteParams = {
  username: string;
};

const GeneralProfileScreen = () => {
  const { token } = useAuth();
  const route = useRoute();
  const params = route.params as RouteParams;
  const username = params.username;
  const [userInfo, setUserInfo] = useState<User>();
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      if (username && token) {
        loadUser(username, setUserInfo, setErrorText, token);
      }
      setLoading(false);
    }, []),
  );

  if (loading) {
    return (
      <View className="bg-white flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (errorText !== "") {
    return <ErrorComp errorText={errorText} />;
  } else if (userInfo !== undefined) {
    return <UserProfile personal={false} userInfo={userInfo} />;
  } else {
    return <ErrorComp errorText="Something went wrong. Please try again." />;
  }
};

export default GeneralProfileScreen;
