import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
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
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState("");

  const fetchPosts = async (loadMore: boolean) => {
    if (!hasMoreData) {
      return;
    }
    let response;
    let data!: ResponseOwnPost;
    let newOffset = loadMore ? offset + 3 : 0;
    const urlWithParams = `${baseUrl}users/${user.username}/feed?offset=${newOffset}&limit=3`;
    try {
      response = await fetch(urlWithParams, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        data = await response.json();
        const updatedRecords = await Promise.all(
          data.records.map(async (record) => {
            const cityName = await getPlaceName(
              record.location.latitude,
              record.location.longitude,
            );
            return {
              ...record,
              city: cityName,
            };
          }),
        );
        setPosts(loadMore ? [...posts, ...updatedRecords] : updatedRecords);
        setOffset(newOffset);
        setHasMoreData(data.pagination.records - data.pagination.offset > 0);
      } else {
        switch (response.status) {
          case 401:
            setError("Auf das Login Popup navigieren!");
            break;
          case 404:
            setError("Die Beiträge konnten nicht geladen werden.");
            break;
          default:
            setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
        }
      }
    } catch (error) {
      setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
    } finally {
      setLoadingMore(false);
    }
  };

  const deletePost = async () => {
    let response;
    const urlWithParams = `${baseUrl}posts/${currentPostId}`;
    try {
      response = await fetch(urlWithParams, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setModalVisible(false);
      } else {
        switch (response.status) {
          case 401:
            setError("Auf das Login Popup navigieren!");
            break;
          case 403:
            setError("Du kannst nur deine eigenen Beiträge löschen.");
            break;
          case 404:
            setError(
              "Der Beitrag, den du löschen möchtest, konnte nicht gefunden werden. Versuche es später erneut.",
            );
            break;
          default:
            setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
        }
      }
    } catch (error) {
      setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
    }
  };

  const getPlaceName = async (latitude: number, longitude: number) => {
    let response;
    let data;
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    try {
      response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        data = await response.json();
        return data.address.city;
      } else {
        return "";
      }
    } catch (error) {
      return "";
    }
  };

  const loadMorePosts = () => {
    if (!loadingMore && hasMoreData) {
      setLoadingMore(true);
      fetchPosts(true);
    }
  };

  useEffect(() => {
    fetchPosts(false);
  }, []);

  const renderHeader = () => {
    return (
      <View className="bg-white pb-4">
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setCurrentPostId("");
            setModalVisible(false);
          }}
        >
          <View
            className="flex-1 justify-center items-center"
            style={{ backgroundColor: "rgba(200, 200, 200, 0.8)" }}
          >
            <View className="bg-white rounded-3xl px-8 py-4">
              <Text className="text-lg mb-10">
                Möchtest du diesen Beitrag wirklich löschen?
              </Text>
              <View className="flex-row">
                <TouchableOpacity onPress={() => deletePost()}>
                  <Text className="text-red text-base font-bold">Löschen</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="ml-auto"
                  onPress={() => {
                    setCurrentPostId("");
                    setModalVisible(false);
                  }}
                >
                  <Text className="text-black text-base font-bold">
                    Abbrechen
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Image
          source={require("../assets/images/Max.jpeg")}
          className="w-full h-48"
          alt="Profilbild"
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
              onPress={() => navigation.navigate("EditProfile", { user: user })}
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
  }

  if (error !== "") {
    return (
      <View className="p-6 bg-white h-full">
        <Text className="text-base">{error}</Text>
      </View>
    );
  } else if (posts !== undefined) {
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
            onLongPress={() => {
              setCurrentPostId(item.postId);
              setModalVisible(true);
            }}
          >
            <View className="flex-row">
              <Text className="w-1/2 text-xs">{item.city}</Text>
              <Text className="w-1/2 text-xs text-right">
                {item.creationDate.split("T")[0]}
              </Text>
            </View>
            <Text className="my-5 text-lg font-semibold text-center">
              {item.content}
            </Text>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator size={"small"} /> : null
        }
        ListHeaderComponent={renderHeader}
      />
    );
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
export default UserProfile;