import React, { useState } from "react";
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
import { User } from "../components/types/User";
import { handleSubscription } from "./functions/HandleSubscription";
import { baseUrl } from "../env";
import { OwnPost, ResponseOwnPost } from "./types/OwnPost";
import { navigate, push } from "../navigation/NavigationService";
import { useAuth } from "../authentification/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import ErrorComp from "./ErrorComp";
import CommentIcon from "./CommentIcon";
import LikeIcon from "./LikeIcon";

type Props = {
  personal: boolean;
  userInfo: User;
};

const UserProfile: React.FC<Props> = ({ userInfo, personal }) => {
  const { token, user } = useAuth();
  const following = userInfo.username;
  const [isFollowed, setIsFollowed] = useState(!!userInfo.subscriptionId);
  const [errorText, setErrorText] = useState("");
  const [subscriptionId, setSubscriptionId] = useState<string | null>(
    userInfo.subscriptionId
  );
  const [posts, setPosts] = useState<OwnPost[]>([]);
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHandlingSubscription, setIsHandlingSubscription] = useState(false);
  const [currentPostId, setCurrentPostId] = useState("");

  const fetchPosts = async (loadMore: boolean) => {
    setLoading(true);
    let response;
    let data!: ResponseOwnPost;
    let newOffset = loadMore ? offset + 3 : 0;
    const urlWithParams = `${baseUrl}users/${userInfo.username}/feed?offset=${newOffset}&limit=3`;
    try {
      response = await fetch(urlWithParams, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      data = await response.json();
      switch (response.status) {
        case 200:
          setPosts(loadMore ? [...posts, ...data.records] : data.records);
          setOffset(newOffset);
          setHasMoreData(data.pagination.records - data.pagination.offset > 3);
          break;
        case 401:
        case 404:
          setErrorText(data.error.message);
          break;
        default:
          setErrorText("Something went wrong, please try again later.");
      }
    } catch (error) {
      setErrorText(
        "There are issues communicating with the server, please try again later."
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const deletePost = async () => {
    let response;
    let data;
    const urlWithParams = `${baseUrl}posts/${currentPostId}`;
    try {
      response = await fetch(urlWithParams, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      switch (response.status) {
        case 204:
          setModalVisible(false);
          fetchPosts(false);
          break;
        case 401:
        case 403:
        case 404:
          data = await response.json();
          setErrorText(data.error.message);
          break;
        default:
          setErrorText("Something went wrong, please try again later.");
      }
    } catch (error) {
      setErrorText(
        "There are issues communicating with the server, please try again later."
      );
    }
  };

  const loadMorePosts = () => {
    if (!loadingMore && hasMoreData) {
      setLoadingMore(true);
      fetchPosts(true);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setErrorText("");
      fetchPosts(false);
    }, [])
  );

  const createChat = async () => {
    let response;
    let data;
    try {
      response = await fetch(`${baseUrl}chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: userInfo.username,
          content: ""
        })
      });
      data = await response.json();
      switch (response.status) {
        case 201:
          navigate("ChatDetail", { chatId: data.chatId });
          break;
        case 400:
        case 401:
        case 404:
        case 409:
          setErrorText(data.error.message);
          break;
        default:
          setErrorText("Something went wrong, please try again later.");
      }
    } catch (error) {
      setErrorText(
        "There are issues communicating with the server, please try again later."
      );
    }
  };
  

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
                Do you really want to delete this post?
              </Text>
              <View className="flex-row">
                <TouchableOpacity onPress={() => deletePost()}>
                  <Text className="text-red text-base font-bold">Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="ml-auto"
                  onPress={() => {
                    setCurrentPostId("");
                    setModalVisible(false);
                  }}
                >
                  <Text className="text-black text-base font-bold">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Image
          source={require("../assets/images/Max.jpeg")}
          className="w-full h-48"
          alt="Picture"
        />
        {/* source={user.profilePictureUrl} sobald die Bilder verfügbar sind */}
        <View className="items-center p-6">
          {userInfo.nickname && (
            <Text className="text-2xl font-bold mb-2">{userInfo.nickname}</Text>
          )}
          <Text className="italic text-lg text-darkgray mb-6">
            @{userInfo.username}
          </Text>
          {userInfo.status && <Text className="mb-8">{userInfo.status}</Text>}
          {personal && (
            <TouchableOpacity
              style={{ ...SHADOWS.small }}
              className="bg-white mb-6 px-12 py-3 rounded-2xl"
              onPress={() => navigate("EditProfile", { user: userInfo })}
            >
              <Text>Edit profile</Text>
            </TouchableOpacity>
          )}
          {!personal && user !== following && (
            <View className="w-full justify-center flex-row space-x-4 mb-6">
              <TouchableOpacity
                style={{ ...SHADOWS.small }}
                className="bg-white py-3 rounded-2xl flex-1"
                onPress={createChat}
              >
                <Text className="text-center">Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...SHADOWS.small }}
                className="bg-white py-3 rounded-2xl flex-1"
                disabled={isHandlingSubscription}
                onPress={() =>
                  handleSubscription(
                    token,
                    isFollowed,
                    setIsFollowed,
                    following,
                    subscriptionId,
                    setSubscriptionId,
                    setErrorText,
                    setIsHandlingSubscription
                  )
                }
              >
                <Text className="text-center">
                  {isFollowed ? "Unfollow" : "Follow"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View className="justify-center flex-row space-around mx-10">
            <View className="items-center justify-center p-3 flex-1">
              <Text className="font-bold text-base">{userInfo.posts}</Text>
              <Text>Posts</Text>
            </View>
            <TouchableOpacity
              className="items-center justify-center p-3 flex-1"
              disabled={userInfo.follower === 0}
              onPress={() =>
                push("FollowerList", {
                  username: userInfo.username,
                })
              }
            >
              <Text className="font-bold text-base">{userInfo.follower}</Text>
              <Text>Follower</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="items-center justify-center p-3 flex-1"
              disabled={userInfo.following === 0}
              onPress={() =>
                push("FollowingList", {
                  username: userInfo.username,
                })
              }
            >
              <Text className="font-bold text-base">{userInfo.following}</Text>
              <Text>Following</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text className="font-bold text-xl ml-6">Posts</Text>
        {posts === null && (
          <Text className="ml-8 mt-2">
            This profile currently has no posts.
          </Text>
        )}
      </View>
    );
  };

  if (loading && !loadingMore) {
    return (
      <View className="bg-white flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (errorText) {
    return <ErrorComp errorText={errorText} />;
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
            activeOpacity={1}
            onLongPress={() => {
              setCurrentPostId(item.postId);
              setModalVisible(true);
            }}
          >
            <View className="flex-row">
              
                <View className="flex items-start w-1/2 flex-col">
                {item.repost !== null && (
                  <Text className="font-semibold text-md text-darkgray italic">Repost</Text>)}
                  <Text className="text-xs">
                {item.creationDate.split("T")[0]}
              </Text>
                  </View>
                  <View className="flex-row w-1/2 items-start justify-end">
                  <CommentIcon onPress={()=>{}}/>
              <LikeIcon
                isLiked={true}
                likes={1}
                handleLikePress={()=>{}}
                formatLikes={(likes: number) => ""}
              />
                  </View>
            </View>
            <Text className="my-5 text-base font-semibold text-center">
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
      <ErrorComp errorText="Something went wrong, please try again later." />
    );
  }
};
export default UserProfile;
