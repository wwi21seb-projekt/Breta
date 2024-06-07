import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { baseUrl } from "../env";
import { useAuth } from "../authentification/AuthContext";
import ErrorComp from "../components/ErrorComp";
import { push } from "../navigation/NavigationService";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../theme";

type Props = {
    notificationId: string,
    timestamp: string,
    notificationType: string,
    username: string,
    profilePictureUrl: string
    onRefresh: () => void
}

const NotificationTab: React.FC<Props> = (props) => {

const {
    notificationId,
    timestamp,
    notificationType,
    username,
    onRefresh
    } = props;
  const { token } = useAuth();
  const [errorText, setErrorText] = useState("");

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
      let data;
      switch (response.status) {
        case 204:
          break;
        case 401:
        case 404:
            data = await response.json()
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

  const  ignoreNotification =  () => {
    deleteNotification();
    onRefresh()
  }


  useFocusEffect(
    React.useCallback(() => {
      setErrorText("");
    }, [])
  );

   if (notificationType == "follow") {
        return(
            <View
            className="flex-row bg-white py-2 my-2 mx-4 border-t"
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
                <Text className="text-base">{username + " now follows you."}</Text>
                <Text className="text-xs text-lightgray">{timestamp.split("T")[0]}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="mt-1" onPress={ignoreNotification}>
                <Ionicons name="close-outline" size={17} color={COLORS.red} />
              </TouchableOpacity>
          </View>
          
        )
   
  } else if (errorText !== "") {
    return <ErrorComp errorText={errorText} />;
  }
  else if (notificationType == "repost") {
    return(
   <View
    className="flex-row items-center bg-white py-2 my-2 mx-4 border-t"
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
            <Text className="text-base ml-3">{username +  " has reposted you."}</Text>
          </TouchableOpacity>
          </View>
            )
  } 
};

export default NotificationTab;
