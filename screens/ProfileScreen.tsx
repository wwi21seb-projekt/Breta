import UserProfile from "../components/UserProfile";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { User } from "../components/types/User";
import { loadUser } from "../components/LoadUser";

const personalUserUsername = "aleks_069";

const ProfileScreen = () => {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState("");

  useEffect(() => {
    loadUser(personalUserUsername, setUser, setError);
  }, []);


  if (error !== "") {
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
