import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SHADOWS } from "../theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { ListUser } from "./types/UserListTypes";
import { baseUrl } from "../env";

type RootStackParamList = {
  GeneralProfile: { username: string };
  Error: { error: string }
};

type NavigationType = StackNavigationProp<RootStackParamList, "GeneralProfile">;

type Props = {
  user: ListUser;
  subscriptionId?: string;
};

const UserListItem: React.FC<Props> = ({ user, subscriptionId }) => {
  const navigation = useNavigation<NavigationType>();
  const following = user.username;
  const [isFollowed, setIsFollowed] = useState(subscriptionId === "" ? false : true);
  const [error, setError] = useState("");

  // Nur relevant für Freundschaftsanfragen
  // const handleAccept = () => {
  //   console.log("Nutzer akzeptiert.");
  // };

  // const handleReject = () => {
  //   console.log("Nutzer abgelehnt.");
  // };

  const handleSubscription = async () => {
    let response;
    if (!isFollowed) {
      try {
        response = await fetch(`${baseUrl}subscriptions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            following 
          })
        });
  
        if (response.ok) {
          setIsFollowed(true);
        } else {
          switch (response.status) {
            case 401:
              setError("Auf das Login Popup navigieren!");
              break;
            case 404:
              setError("Der Nutzer, den du abbonieren möchtest, wurde nicht gefunden. Versuche es später erneut.");
              break;
            case 406:
              setError("Du kannst dir nicht selbst folgen.");
              break;
            case 409:
              setError("Du folgst diesem Nutzer bereits.");
              break;  
            default:
              setError("Etwas ist schiefgelaufen. Versuche es später erneut.")
          }
        }
      } catch (error) {
        setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
      }
    }
    else {
      try {
        response = await fetch(`${baseUrl}subscriptions:${subscriptionId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          }
        });
        if (response.ok) {
          setIsFollowed(false);
        } else {
          switch (response.status) {
            case 401:
              setError("Auf das Login Popup navigieren!");
              break;
            case 403:
              setError("Du kannst nur deine eigenen Abbonements löschen.");
              break;
            case 404:
              setError("Der Nutzer, den du deabbonieren möchtest, wurde nicht gefunden. Versuche es später erneut.");
              break; 
            default:
              setError("Etwas ist schiefgelaufen. Versuche es später erneut.")
          }
        }
      } catch (error) {
        setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
      }
    }
    
  };
  if (error !== "") {
    navigation.navigate("Error", { error: error })
    } else {
  return (
    <View
            className="flex-row items-center rounded-3xl bg-white py-2 px-4 my-2 mx-6"
            style={{ ...SHADOWS.small }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("GeneralProfile", { username: user.username });
              }}
              className="flex-1 flex-row items-center"
            >
              <Image
              source={require("../assets/images/Max.jpeg")}
                // source={user.profilePictureUrl} sobald Bilder da sind
                className="aspect-square rounded-full w-10"
              />
              <Text className="text-base ml-3">{user.username}</Text>
            </TouchableOpacity>

              {/* Das wäre für eine Freundschaftsanfrage
                <TouchableOpacity
                  className="mr-2"
                  onPress={() => handleAccept()}
                >
                  <Icon
                    as={Ionicons}
                    name="checkmark-outline"
                    size="md"
                    color={COLORS.green}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleReject()}>
                  <Icon
                    as={Ionicons}
                    name="close-outline"
                    size="md"
                    color={COLORS.red}
                  />
                </TouchableOpacity> */}
          
              <TouchableOpacity
                className="py-1 px-2 rounded-3xl"
                style={{ borderWidth: 1 }}
                onPress={() => handleSubscription()}
              >
                <Text className="text-xs">
                  {isFollowed ? "Entfolgen" : "Folgen"}
                </Text>
              </TouchableOpacity>
          </View>
  );
              };
};

export default UserListItem;
