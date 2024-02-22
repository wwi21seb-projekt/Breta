import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SHADOWS } from "../theme";
import { handleSubscription } from "./functions/HandleSubscription";
import { push } from "../navigation/NavigationService";
import ErrorComp from "./ErrorComp";
import { useAuth } from "../authentification/AuthContext";


type Props = {
  username: string;
  profilePictureUrl: string;
  followingId?: string | null;
};

const UserListItem: React.FC<Props> = ({
  username,
  profilePictureUrl,
  followingId,
}) => {
  const {token, user} = useAuth();
  const [isFollowed, setIsFollowed] = useState(followingId !== null);
  const [subscriptionId, setSubscriptionId] = useState(
    followingId !== undefined ? followingId : null,
  );
  const [errorText, setErrorText] = useState("");

  // Nur relevant für Freundschaftsanfragen
  // const handleAccept = () => {
  //   console.log("Nutzer akzeptiert.");
  // };

  // const handleReject = () => {
  //   console.log("Nutzer abgelehnt.");
  // };

  if (errorText !== "") {
    return (
      <ErrorComp errorText={errorText} />
    );
  } else {
    return (
      <View
        className="flex-row items-center rounded-3xl bg-white py-2 px-4 my-2 mx-6"
        style={{ ...SHADOWS.small }}
      >
        <TouchableOpacity
          onPress={() => {
            push("GeneralProfile", { username: username });
          }}
          className="flex-1 flex-row items-center"
        >
          <Image
            source={require("../assets/images/Max.jpeg")}
            // source={profilePictureUrl} sobald Bilder da sind
            className="aspect-square rounded-full w-10"
            alt="Picture"
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
          {user !== username && (
          <TouchableOpacity
            className="py-1 px-2 rounded-3xl border"
            onPress={() =>
              handleSubscription(
                token,
                isFollowed,
                setIsFollowed,
                username,
                subscriptionId,
                setSubscriptionId,
                setErrorText,
              )
            }
          >
            <Text className="text-xs">
              {isFollowed ? "Unfollow" : "Follow"}
            </Text>
          </TouchableOpacity>
          )}
      </View>
    );
  }
};

export default UserListItem;
