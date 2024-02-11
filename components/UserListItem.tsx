import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SHADOWS } from "../theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { handleSubscription } from "./functions/HandleSubscription";

type RootStackParamList = {
  GeneralProfile: { username: string };
};

type NavigationType = StackNavigationProp<RootStackParamList, "GeneralProfile">;

type Props = {
  username: string;
  profilePictureUrl: string;
  enableFollowHandling: boolean;
  followingId?: string;
};

const UserListItem: React.FC<Props> = ({
  username,
  profilePictureUrl,
  enableFollowHandling,
  followingId,
}) => {
  const navigation = useNavigation<NavigationType>();
  const [isFollowed, setIsFollowed] = useState(followingId !== "");
  const [subscriptionId, setSubscriptionId] = useState(
    followingId !== undefined ? followingId : "",
  );
  const [error, setError] = useState("");

  // Nur relevant für Freundschaftsanfragen
  // const handleAccept = () => {
  //   console.log("Nutzer akzeptiert.");
  // };

  // const handleReject = () => {
  //   console.log("Nutzer abgelehnt.");
  // };

  if (error !== "") {
    return (
    <View>
      <Text>Maaaan!</Text>
    </View>
    );
  } else {
    return (
      <View
        className="flex-row items-center rounded-3xl bg-white py-2 px-4 my-2 mx-6"
        style={{ ...SHADOWS.small }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("GeneralProfile", { username: username });
          }}
          className="flex-1 flex-row items-center"
        >
          <Image
            source={require("../assets/images/Max.jpeg")}
            // source={profilePictureUrl} sobald Bilder da sind
            className="aspect-square rounded-full w-10"
            alt="Profilbild"
          />
          <Text className="text-base ml-3">{username}</Text>
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
        {enableFollowHandling === true && (
          <TouchableOpacity
            className="py-1 px-2 rounded-3xl border"
            onPress={() =>
              handleSubscription(
                isFollowed,
                setIsFollowed,
                username,
                subscriptionId,
                setSubscriptionId,
                setError,
              )
            }
          >
            <Text className="text-xs">
              {isFollowed ? "Entfolgen" : "Folgen"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
};

export default UserListItem;
