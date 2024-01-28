import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, SafeAreaView } from "react-native";
import { SHADOWS } from "../theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { User } from "../components/types/User";
import { handleSubscription } from "./functions/HandleSubscription";
import { baseUrl } from "../env";
import { OwnPost, ResponseOwnPost } from "./types/OwnPost";

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
  const [subscriptionId, setSubscriptionId] = useState(user.subscriptionId);
  const [posts, setPosts] = useState<OwnPost[]>([]);

  const fetchPosts = async () => {
    let response;
    let data!: ResponseOwnPost;
    try {
      response = await fetch(`${baseUrl}users/:${user.username}/feed?offset=0&limit=10`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        data = await response.json();
        setPosts(data.records);
      } else {
        switch (response.status) {
          case 401:
            setError("Auf das Login Popup navigieren!");
            break;
          case 404:
            setError("Die Beiträge konnten nicht geladen werden.")
            break;
          default:
            setError("Etwas ist schiefgelaufen. Versuche es später erneut.")
        }
      }
    } catch (error) {
      setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
    }
  };

  useEffect(() => {
    fetchPosts()
    // .finally(() => {
    //   setLoading(false);
    // });
  }, []);

  const renderHeader = () => {
    return (
      <View className="bg-white pb-4">
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
                      setSubscriptionId,
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
      </View>
    );
  };

  if (error !== "") {
    return (
      <View className="p-6 bg-white h-full">
        <Text className="text-base">{error}</Text>
      </View>
    );
  } else if (posts !== undefined){
    return (
      <FlatList 
      className="bg-white"
      data={posts}
      keyExtractor={(item) => item.postId}
      renderItem={({ item }) => (
        <TouchableOpacity 
        className="bg-secondary w-5/6 self-center rounded-2xl justify-center items-center mb-5 px-3 py-1" 
        style={{ ...SHADOWS.small }}
        disabled={!personal}
        onLongPress={()=> console.log("Jaaaa")}>
        <View className="flex-row">
          <Text className="w-1/2 text-xs">{item.content}</Text>
          <Text className="w-1/2 text-xs text-right">{item.creationDate}</Text>
        </View>
        <Text className="my-5 text-lg font-semibold text-center">{item.content}</Text>
      </TouchableOpacity>
      )}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={renderHeader}
      />
    );
  }
  else {
    return (
      <View className="p-6 bg-white h-full">
        <Text className="text-base">
          Etwas ist schiefgelaufen. Versuche es später erneut.
        </Text>
      </View>
    );
  }
};
export default UserProfile;
