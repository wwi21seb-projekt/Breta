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
}

const TextPostCard: React.FC<Props> = (props) => {
  const {
    username,
    postContent,
    profilePic,
    date,
    city,
    initialLikes = 149999,
  } = props;
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

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

  return (
    <View className="items-center mx-2.5 mb-5">
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
            <Text className="text-xs text-lightgray text-l "> {date}</Text>
          </View>
        </View>
      </View>

      <View className="bg-secondary w-11/12 rounded-3xl p-5 pt-8 mt-[-20px] z-10 relative">
        <Text>{postContent}</Text>
      </View>

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
                        {comment.date}
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
