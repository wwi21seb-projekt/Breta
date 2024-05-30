import UserListItem from "../components/UserListItem";
import React, { useState } from "react";
import { View, Image, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { baseUrl } from "../env";
import { AboRecords, UserRecords } from "../components/types/UserListTypes";
import { useAuth } from "../authentification/AuthContext";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import ErrorComp from "../components/ErrorComp";
import { SHADOWS } from "../theme";
import { push } from "../navigation/NavigationService";

type Props = {
    notificationId: string,
    timestamp: string,
    notificationType: string,
    username: string,
    profilePictureUrl: string
}

const NotificationTab: React.FC<Props> = (props) => {

const {
    notificationId,
    timestamp,
    notificationType,
    username,
    profilePictureUrl,
    } = props;
  const { token } = useAuth();
  const [errorText, setErrorText] = useState("");
  const [offset, setOffset] = useState(0);

  const deleteNotification = async () => {

    let response;

    try {
      response = await fetch(`${baseUrl}notifications/${notificationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      switch (response.status) {
        case 204:
          break;
        case 401:
        case 404:
            const data = await response.json()
            setErrorText(data.error.message)
          break;
        default:
          setErrorText("Something went wrong, please try again later.")
      }
    } catch (error) {
      setErrorText(
        "There are issues communicating with the server, please try again later.",
      );
    }
  }

  const pressNotification =  () => {

    deleteNotification();
    push("GeneralProfile", { username: username });

  }

  if (errorText !== "") {
    return <ErrorComp errorText={errorText} />;
  } else if (notificationType == "follow") {
        return(
            <View
            className="flex-row items-center rounded-3xl bg-white py-2 px-4 my-2 mx-6"
            style={{ ...SHADOWS.small }}
          >
            <TouchableOpacity className="flex-1 flex-row items-center"
            onPress={pressNotification}>
              <Image
                source={require("../assets/images/Max.jpeg")}
                // source={profilePictureUrl} sobald Bilder da sind
                className="aspect-square rounded-full w-10"
                alt="Picture"
              />
              <View className="ml-3">
                <Text className="text-base">{username + " now follows you"}</Text>
                <Text className="text-xxs text-lightgray">{timestamp.split("T")[0]}</Text>
              </View>
            </TouchableOpacity>
          </View>
          
        )
   
  } else if (notificationType == "repost") {
    return(
   <View
    className="flex-row items-center rounded-3xl bg-white py-2 px-4 my-2 mx-6"
    style={{ ...SHADOWS.small }}
    >
            <TouchableOpacity
                className="flex-1 flex-row items-center"
                onPress={pressNotification}
            >
            <Image
              source={require("../assets/images/Max.jpeg")}
              // source={profilePictureUrl} sobald Bilder da sind
              className="aspect-square rounded-full w-10"
              alt="Picture"
            />
            <Text className="text-base ml-3">{username +  " has reposted you"}</Text>
          </TouchableOpacity>
          </View>
            )
  } else {
    return (
      <ErrorComp errorText="Something went wrong, please try again later." />
    );
  }
};

export default NotificationTab;
