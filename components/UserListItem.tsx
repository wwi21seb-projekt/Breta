import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, Dispatch, SetStateAction } from "react";
import { SHADOWS } from "../theme";
import { handleSubscription } from "./functions/HandleSubscription";
import { push } from "../navigation/NavigationService";
import { useAuth } from "../authentification/AuthContext";

type Props = {
  username: string;
  profilePictureUrl: string;
  followingId?: string | null;
  setErrorText: Dispatch<SetStateAction<string>>;
};

const UserListItem: React.FC<Props> = ({
  username,
  profilePictureUrl,
  followingId,
  setErrorText,
}) => {
  // Get token and user info from authentication context
  const { token, user } = useAuth();

  // State to manage follow/unfollow status
  const [isFollowed, setIsFollowed] = useState(followingId !== null);
  const [subscriptionId, setSubscriptionId] = useState(
    followingId !== undefined ? followingId : null,
  );

  // State to manage subscription handling status
  const [isHandlingSubscription, setIsHandlingSubscription] = useState(false);

  return (
    <View
      className="flex-row items-center rounded-3xl bg-white p-2 my-2 mx-6"
      style={{ ...SHADOWS.small }}
    >
      {/* Touchable opacity to navigate to user profile */}
      <TouchableOpacity
        onPress={() => {
          push("GeneralProfile", { username: username });
        }}
        className="flex-1 flex-row items-center"
      >
        {/* Display user profile picture */}
        <Image
          source={{ uri: profilePictureUrl || "defaultProfilePic" }}
          className="aspect-square rounded-full w-10"
          alt="Picture"
        />
        {/* Display username */}
        <Text className="text-base ml-3">{username}</Text>
      </TouchableOpacity>

      {/* Follow/Unfollow button */}
      {user !== username && followingId !== "searchResult" && (
        <TouchableOpacity
          className="py-1 px-2 rounded-3xl border"
          disabled={isHandlingSubscription}
          onPress={() =>
            handleSubscription(
              token,
              isFollowed,
              setIsFollowed,
              username,
              subscriptionId,
              setSubscriptionId,
              setErrorText,
              setIsHandlingSubscription,
            )
          }
        >
          {/* Toggle button text based on follow status */}
          <Text className="text-xs">{isFollowed ? "Unfollow" : "Follow"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UserListItem;
