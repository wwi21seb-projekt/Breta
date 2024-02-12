import UserProfile from "../components/UserProfile";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { User } from "../components/types/User";
import { loadUser } from "../components/functions/LoadUser";
import { checkAuthentification } from "../authentification/CheckAuthentification";
import LoginPopup from "../components/LoginPopup";

const personalUserUsername = "aleks_069";

const ProfileScreen = () => {
  const isAuthenticated = checkAuthentification();

  const [user, setUser] = useState<User>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser(personalUserUsername, setUser, setError).finally(() => {
      setLoading(false);
    });
  }, []);

  if (!isAuthenticated) {
    return <LoginPopup />;
  } else if (loading) {
    return (
      <View className="bg-white flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (error !== "") {
    return (
      <View className="p-6 bg-white h-full">
        <Text className="text-base">{error}</Text>
      </View>
    );
  } else if (user !== undefined) {
    return <UserProfile personal={true} user={user} />;
  } else {
    return (
      <View className="p-6 bg-white h-full">
        <Text className="text-base">
          Etwas ist schiefgelaufen. Versuche es später erneut.
        </Text>
      </View>
    );
  }
};

export default ProfileScreen;
