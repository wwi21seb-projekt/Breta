import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  View,
  Text,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SHADOWS, COLORS } from "../theme";
import { baseUrl } from "../env";
import { useAuth } from "../authentification/AuthContext";

const windowHeight = Dimensions.get("window").height;

interface Comment {
  id: string;
  text: string;
  username: string;
  profilePic: string;
  date: string;
}

interface Props {
  username: string;
  profilePic: string;
  date: string; 
  initialLikes?: number;
  postContent: any;
  style?: React.CSSProperties;
  city: string;
  postId: string;
  repostAuthor?: string;
  isRepost: boolean;
}

const TextPostCard: React.FC<Props> = (props) => {
  const { token } = useAuth();
  const {
    username,
    postContent,
    profilePic,
    date,
    city,
    initialLikes = 149999,
    postId,
    repostAuthor,
    isRepost
    } = props;
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [isPostRepost, setisPostRepost] = useState(false)

  const addComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: Date.now().toString(),
        text: commentText,
        username: username,
        profilePic: profilePic,
        city: city,
      };
      setComments([...comments, newComment]);
      setCommentText("");
    }
  };

  const formatLikes = (count: number): string => {
    const roundToTenths = (num: number) => Math.floor(num * 10) / 10;

    if (count >= 1000000) {
      return roundToTenths(count / 1000000) + " M";
    }
    if (count >= 1000) {
      return roundToTenths(count / 1000) + " T";
    }
    return count.toString();
  };

  const handleLikePress = () => {
    const newLikes = isLiked ? Math.max(likes - 1, 0) : likes + 1;
    setLikes(newLikes);
    setIsLiked(!isLiked);
  };

  const openCommentModal = () => {
    setCommentModalVisible(true);
  };

  const closeCommentModal = () => {
    setCommentModalVisible(false);
  };

  const repostPost =  async () => {
    let response;

    try {
      response = await fetch(`${baseUrl}posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          repostedPostId: postId,
          content: postContent
        }),
      });
      switch (response.status) {
        case 201:

          break;
        case 400:

          break;
        case 401:
          
          break;
        default:
      }
    } catch (error) {
    }
  };


  return (
    <View className="items-center mx-2.5 mb-5">
      {!isRepost ? (
      <View
        className="w-full bg-white rounded-full p-4 z-20 relative"
        style={{ ...SHADOWS.small }}
      >
        <View className="flex-row items-center justify-between">
          <Image
            source={{ uri: profilePic }}
            className="w-10 h-10 rounded-full"
            alt="PB"
          />
          <View className="flex-1 ml-2">
            <Text className="font-bold">{username}</Text>
            <Text className="text-xs text-lightgray"> {city}</Text>
          </View>

          <View className="flex flex-col justify-end items-end">
            <View className="flex flex-row">
            <TouchableOpacity onPress={repostPost}>
                <Ionicons
                  name="repeat-outline"
                  size={18}
                  color={COLORS.black}
                  className="mr-1"
                />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={openCommentModal}>
                <Ionicons
                  name="chatbox-ellipses-outline"
                  size={18}
                  color={COLORS.black}
                  className="mr-1"
                />
              </TouchableOpacity> 
              <TouchableOpacity
                className="flex-row items-center"
                onPress={handleLikePress}
              >
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={18}
                  color={isLiked ? COLORS.primary : "black"}
                  className="mr-1"
                />
                <Text className="ml-1">{formatLikes(likes)}</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-xs text-lightgray text-l "> {date.split("T")[0]}</Text>
          </View>
        </View>
      </View>
      
      ) : (
        <View className="w-full bg-white rounded-xl p-4" style={{ ...SHADOWS.small }}>
          <View className="flex flex-col justify-end items-end z-20 relative" >
              <View className="flex-row items-center justify-between">
              <View className="flex-1 ml-2 pt-4">
                <Text className="font-bold">{username}</Text>
                <Text className="text-xs text-lightgray"> {city}</Text>
              </View>
                <TouchableOpacity onPress={openCommentModal}>
                  <Ionicons
                    name="chatbox-ellipses-outline"
                    size={18}
                    color={COLORS.black}
                    className="mr-1"
                  />
                </TouchableOpacity> 
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={handleLikePress}
                >
                  <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={18}
                    color={isLiked ? COLORS.primary : "black"}
                    className="mr-1"
                  />
                  <Text className="ml-1">{formatLikes(likes)}</Text>
                </TouchableOpacity>
              </View>
              <Text className="text-xs text-lightgray text-l mt-[-14] mb-1"> {date.split("T")[0]}</Text>
            <View
            className="w-full bg-white rounded-full p-4 z-10 relative"
            style={{ ...SHADOWS.small }}
            >
              <View className="w-full flex-row items-center">
                <Image
                  source={{ uri: profilePic }}
                  className="w-10 h-10 rounded-full"
                  alt="PB"
                />
                <View className="ml-2">
                  <Text className="align-center font-bold">{repostAuthor}</Text>
                  <Text className="text-xs text-lightgray"> {city}</Text>
                  <Text className="text-xs text-lightgray text-l mt-[-15]"> {date.split("T")[0]}</Text>
                </View>
            </View>
          </View>
        </View>
        <View className="m-1.5 bg-secondary rounded-3xl p-5 pt-8 mt-[-20px] z-10">
            <Text>{postContent}</Text>
          </View>
        </View>
      ) }
    {!isRepost ? (
      <View className="bg-secondary w-11/12 rounded-3xl p-5 pt-8 mt-[-20px] z-10 relative">
        <Text>{postContent}</Text>
      </View>
    ) : (<></>) }

      <Modal
        visible={isCommentModalVisible}
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <View className="flex-1 justify-end">
          <View className=" rounded-t-xl p-5 h-3/4">
            <View className="flex-row justify-between items-center border-b border-lightgray pb-4">
              <Text className="text-lg font-bold">Kommentare</Text>
              <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
                <Ionicons name="close" size={18} color="black" />
              </TouchableOpacity>
            </View>
            <ScrollView className="pt-4">
              {comments.length === 0 ? (
                <Text className="text-center text-sm py-5">
                  Es sind noch keine Kommentare da!
                </Text>
              ) : (
                comments.map((comment) => (
                  <View
                    key={comment.id}
                    className="flex-row items-start py-3 border-b border-lightgray"
                  >
                    <Image
                      source={{ uri: comment.profilePic }}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <View className="flex-1">
                      <Text className="font-bold">{comment.username}</Text>
                      <Text>{comment.text}</Text>
                      <Text className="text-xs text-lightgray">
                        {comment.date.split("T")[0]}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
            <View className="flex-row items-center border-t border-lightgray p-4">
              <TextInput
                className="flex-1 mr-4 bg-lightgray rounded-full p-3 text-sm"
                placeholder="Schreiben Sie einen Kommentar..."
                onChangeText={setCommentText}
                value={commentText}
                multiline
              />
              <TouchableOpacity
                className="bg-brigtBlue p-3 rounded-full"
                onPress={addComment}
              >
                <Text className=" font-bold text-sm">Posten</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TextPostCard;
