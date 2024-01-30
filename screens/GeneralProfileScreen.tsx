import UserProfile from "../components/UserProfile";
import { useState, useEffect } from "react";
import { User } from "../components/types/User";
import { Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { loadUser } from "../components/functions/LoadUser";

type RouteParams = {
  username: string;
};

const GeneralProfileScreen = () => {
  const route = useRoute();
  const params = route.params as RouteParams;
  const username = params.username;
  const [user, setUser] = useState<User>();
  const [error, setError] = useState("");

  useEffect(() => {
    loadUser(username, setUser, setError);
  }, []);

  if (error !== "") {
    return (
      <View className="p-6 bg-white h-full">
        <Text className="text-base">{error}</Text>
      </View>
    );
  } else if (user !== undefined) {
    return <UserProfile personal={false} user={user} />;
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

export default GeneralProfileScreen;
