import UserProfile from "../components/UserProfile";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { User } from "../components/types/User";
import { loadUser } from "../components/functions/LoadUser";
import { useAuth } from "../authentification/AuthContext";
import ErrorComp from "../components/ErrorComp";

const ProfileScreen = () => {
  const {user, token} = useAuth();
  const [userInfo, setUserInfo] = useState<User>();
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if(user && token){
      loadUser(user, setUserInfo, setErrorText, token);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View className="bg-white flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (errorText !== "") {
    return (
      <View className="p-6 bg-white h-full">
        <Text className="text-base">{errorText}</Text>
      </View>
    );
  } else if (userInfo !== undefined) {
    return <UserProfile personal={true} userInfo={userInfo} />;
  } else {
    return (
      <ErrorComp errorText="Something went wrong. Please try again."/>
    );
  }
};

export default ProfileScreen;
