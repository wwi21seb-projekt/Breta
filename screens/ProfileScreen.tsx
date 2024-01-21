import UserProfile from "../components/UserProfile";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { User } from "../components/types/User";
import { baseUrl } from "../env";

const personalUserUsername = "aleks_069";

const ProfileScreen = () => {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      let data;
      const urlWithParams = `${baseUrl}users/:${personalUserUsername}`;
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
                "Dein Profil konnte nicht geladen werden. Versuche es später erneut.",
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
