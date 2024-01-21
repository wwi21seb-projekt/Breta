import UserProfile from "../components/UserProfile";
import { baseUrl } from "../env";
import { useState, useEffect } from "react";
import { User } from "../components/types/User";
import { Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";

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
    (async () => {
      let data;
      const urlWithParams = `${baseUrl}users/:${username}`;
      let response;

      try {
        response = await fetch(urlWithParams, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          data = await response.json();
          setUser(data);
        } else {
          switch (response.status) {
            case 401:
              setError("Auf das Login Popup navigieren!");
              break;
            case 404:
              setError(
                "Das Profil konnte nicht geladen werden. Versuche es später erneut.",
              );
              break;
            default:
              setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
          }
        }
      } catch (error) {
        setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
      }
    })();
  });

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
