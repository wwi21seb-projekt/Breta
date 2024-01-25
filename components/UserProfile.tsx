import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { SHADOWS } from "../theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { dummyUrls } from "../DummyData";
import { User } from "../components/types/User";
import { handleSubscription } from "./functions/HandleSubscription";

type RootStackParamList = {
  FollowerList: { type: string; username: string };
  Authentification: undefined;
  EditProfile: { user: any };
};

type Props = {
  personal: boolean;
  user: User;
};
type NavigationType = StackNavigationProp<RootStackParamList, "FollowerList">;

const UserProfile: React.FC<Props> = ({ user, personal }) => {
  const navigation = useNavigation<NavigationType>();

  const following = user.username;
  const [isFollowed, setIsFollowed] = useState(user.subscriptionId !== "");
  const [error, setError] = useState("");
  const subscriptionId = user.subscriptionId;
  if (error !== "") {
    return (
      <View className="p-6 bg-white h-full">
        <Text className="text-base">{error}</Text>
      </View>
    );
  } else {
    return (
      <View className="bg-white pb-4">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image
            source={require("../assets/images/Max.jpeg")}
            className="w-full h-48"
          />
          {/* source={user.profilePictureUrl} sobald die Bilder verfügbar sind */}
          <View className="items-center p-6">
            <Text className="text-2xl font-bold mb-2">{user.nickname}</Text>
            <Text className="italic text-lg text-darkgray mb-6">
              @{user.username}
            </Text>
            <Text className="mb-8">{user.status}</Text>
            {personal === true ? (
              <TouchableOpacity
                style={{ ...SHADOWS.small }}
                className="bg-white mb-10 px-12 py-4 rounded-full"
                onPress={() =>
                  navigation.navigate("EditProfile", { user: user })
                }
              >
                <Text>Profil bearbeiten</Text>
              </TouchableOpacity>
            ) : (
              <View className="w-full justify-center flex-row space-x-4">
                <TouchableOpacity
                  style={{ ...SHADOWS.small }}
                  className="bg-white my-10 px-12 py-3 rounded-2xl"
                  onPress={() => console.log("Chat starten")}
                >
                  <Text>Chatten</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ ...SHADOWS.small }}
                  className="bg-white my-10 px-12 py-3 rounded-2xl"
                  onPress={() =>
                    handleSubscription(
                      isFollowed,
                      setIsFollowed,
                      following,
                      subscriptionId,
                      setError,
                    )
                  }
                >
                  <Text>{isFollowed ? "Entfolgen" : "Folgen"}</Text>
                </TouchableOpacity>
              </View>
            )}

            <View className="w-full justify-center flex-row space-around">
              <View className="items-center justify-center p-3">
                <Text className="font-bold text-base">{user.posts}</Text>
                <Text>Beiträge</Text>
              </View>
              <TouchableOpacity
                className="items-center justify-center p-3"
                onPress={() =>
                  navigation.navigate("FollowerList", {
                    type: "followers",
                    username: user.username,
                  })
                }
              >
                <Text className="font-bold text-base">{user.follower}</Text>
                <Text>Follower</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="items-center justify-center p-3"
                onPress={() =>
                  navigation.navigate("FollowerList", {
                    type: "following",
                    username: user.username,
                  })
                }
              >
                <Text className="font-bold text-base">{user.following}</Text>
                <Text>Gefolgt</Text>
              </TouchableOpacity>
              {personal === true && (
                <TouchableOpacity
                  className="items-center justify-center p-3"
                  onPress={
                    () =>
                      console.log(
                        "Freundschaftsanfragen: Wird noch implementiert",
                      )
                    // navigation.navigate("FollowerList", {
                    //   type: "request"

                    // })
                  }
                >
                  <Text className="font-bold text-base">0</Text>
                  <Text>Anfragen</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <Text className="font-bold text-xl ml-6">Beiträge</Text>
          <View className="flex-row justify-between flex-wrap mx-6 my-2">
            {dummyUrls.map((url, index) => (
              <Image
                key={index}
                source={url}
                className="rounded-3xl aspect-square my-2"
                style={{ width: "47%" }}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
};
export default UserProfile;
