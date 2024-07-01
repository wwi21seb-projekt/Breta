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
  const { token, user } = useAuth();
  const [isFollowed, setIsFollowed] = useState(followingId !== null);
  const [subscriptionId, setSubscriptionId] = useState(
    followingId !== undefined ? followingId : null,
  );
  const [isHandlingSubscription, setIsHandlingSubscription] = useState(false);

  return (
    <View
      className="flex-row items-center rounded-3xl bg-white p-2 my-2 mx-6"
      style={{ ...SHADOWS.small }}
    >
      <TouchableOpacity
        onPress={() => {
          push("GeneralProfile", { username: username });
        }}
        className="flex-1 flex-row items-center"
      >
        <Image
          source={{uri: profilePictureUrl || "defaultProfilePic"}}
          className="aspect-square rounded-full w-10"
          alt="Picture"
        />
        <Text className="text-base ml-3">{username}</Text>
      </TouchableOpacity>

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
          <Text className="text-xs">{isFollowed ? "Unfollow" : "Follow"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UserListItem;
