import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image, Icon } from "native-base";
import { TextInput,Dimensions, ScrollView ,TouchableOpacity, Modal } from "react-native";
import { SHADOWS } from "../theme";

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
}

const TextPostCard: React.FC<Props> = (props) => {
  const {
    username,
    postContent,
    profilePic,
    date,
    initialLikes = 149999
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
      <View className="w-full bg-white rounded-full p-4 z-20 relative" style={{ ...SHADOWS.small }}>
        <View className="flex-row items-center justify-between">
          <Image
            source={{ uri: profilePic }}
            className="w-10 h-10 rounded-full"
          />
          <View className="flex-1 ml-2">
            <Text className="font-bold">{username}</Text>
            <Text className="text-xs text-gray-500">{date}</Text>
          </View>
          <TouchableOpacity onPress={openCommentModal}>
          <Icon
              as={Ionicons}
              name="chatbox-ellipses-outline"
              size={24}
              className="mr-1"
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center"
            onPress={handleLikePress}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? "aqua" : "black"}
            />
            <Text className="ml-1">{formatLikes(likes)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="bg-green w-11/12 rounded-3xl p-5 pt-8 mt-[-20px] z-10 relative">
        <Text>{postContent}</Text>
      </View>

      <Modal
        visible={isCommentModalVisible}
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-opacity-50">
          <View className="bg-white rounded-t-xl p-5 h-3/4">
            <View className="flex-row justify-between items-center border-b border-gray pb-4">
              <Text className="text-lg font-bold">Kommentare</Text>
              <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
                <Ionicons name="close" size={24} color="black" />
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
                    className="flex-row items-start py-3 border-b border-gray"
                  >
                    <Image
                      source={{ uri: comment.profilePic }}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <View className="flex-1">
                      <Text className="font-bold">{comment.username}</Text>
                      <Text>{comment.text}</Text>
                      <Text className="text-xs text-gray-500">
                        {comment.date}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
            <View className="flex-row items-center border-t border-gray p-4">
              <TextInput
                className="flex-1 mr-4 bg-gray rounded-full p-3 text-sm"
                placeholder="Schreiben Sie einen Kommentar..."
                onChangeText={setCommentText}
                value={commentText}
                multiline
              />
              <TouchableOpacity className="bg-blue p-3" onPress={addComment}>
                <Text className="text-blue font-bold text-sm">Posten</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TextPostCard;
