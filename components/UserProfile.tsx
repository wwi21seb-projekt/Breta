import React, { useState, useEffect } from "react";
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
  Pressable,
} from "react-native";
import { SHADOWS, COLORS } from "../theme";
import { baseUrl } from "../env";
import LoginPopup from "./LoginPopup";
import { useCheckAuthentication } from "../authentification/CheckAuthentification";
import { useAuth } from "../authentification/AuthContext";
import { loadUser } from "./functions/LoadUser";
import { User } from "./types/User";

const windowHeight = Dimensions.get("window").height;

interface Comment {
  commentId: string;
  content: string;
  author: {
    username: string;
    nickname: string;
    profilePictureURL: string;
  };
  creationDate: string;
}

interface Props {
  postId: string;
  username: string;
  profilePic: string;
  date: string;
  initialLikes?: number;
  postContent: any;
  style?: React.CSSProperties;
  city: string;
  initialLiked?: boolean;
}

const TextPostCard: React.FC<Props> = (props) => {
  const {
    postId,
    username,
    postContent,
    profilePic,
    date,
    city,
    initialLikes = 0,
    initialLiked = false,
  } = props;
  const { token, user } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentError, setCommentError] = useState<string | null>(null);
  const isAuthenticated = useCheckAuthentication();
  const [isLoginPopupVisible, setLoginPopupVisible] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUser(user, setCurrentUser, setCommentError, token);
    }
    fetchComments();
    fetchLikeStatus();
  }, []);

  const fetchComments = async () => {
    const url = `${baseUrl}posts/${postId}/comments?limit=10&offset=0`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const text = await response.text();
        if (text) {
          const data = JSON.parse(text);
          setComments(data.records || []);
          setCommentError(null);
        } else {
          setComments([]);
          setCommentError(null);
        }
      } else {
        handleFetchError(response.status);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setCommentError(
        "There are issues communicating with the server, please try again later."
      );
    }
  };

  const fetchLikeStatus = async () => {
    const url = `${baseUrl}posts/${postId}/like-status`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikes(data.likes);
      } else {
        handleFetchError(response.status);
      }
    } catch (error) {
      console.error("Error fetching like status:", error);
    }
  };

  const handleFetchError = (status: number) => {
    switch (status) {
      case 401:
        setCommentError("Unauthorized request.");
        break;
      default:
        setCommentError("Something went wrong, please try again later.");
    }
  };

  const addComment = async () => {
    if (!isAuthenticated) {
      setLoginPopupVisible(true);
      return;
    }

    if (commentText.trim() && currentUser) {
      const url = `${baseUrl}posts/${postId}/comments`;
      const newComment = {
        content: commentText,
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newComment),
        });

        if (response.ok) {
          const text = await response.text();
          if (text) {
            const addedComment = JSON.parse(text);
            const formattedComment = {
              commentId: addedComment.commentId || `${Date.now()}-${Math.random()}`,
              content: addedComment.content,
              author: {
                username: currentUser.username,
                nickname: "",
                profilePictureURL: currentUser.profilePictureURL,
              },
              creationDate: new Date().toISOString(),
            };
            setComments([...comments, formattedComment]);
            setCommentText("");
            setCommentError(null);
          }
        } else {
          handleFetchError(response.status);
        }
      } catch (error) {
        console.error("Error adding comment:", error);
        setCommentError(
          "There are issues communicating with the server, please try again later."
        );
      }
    }
  };

  const likePost = async () => {
    if (!isAuthenticated) {
      setLoginPopupVisible(true);
      return;
    }

    const url = `${baseUrl}posts/${postId}/likes`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setLikes((prevLikes) => prevLikes + 1);
        setIsLiked(true);
      } else {
        handleFetchError(response.status);
      }
    } catch (error) {
      console.error("Error liking the post:", error);
      setCommentError(
        "There are issues communicating with the server, please try again later."
      );
    }
  };

  const unlikePost = async () => {
    if (!isAuthenticated) {
      setLoginPopupVisible(true);
      return;
    }

    const url = `${baseUrl}posts/${postId}/likes`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setLikes((prevLikes) => Math.max(prevLikes - 1, 0));
        setIsLiked(false);
      } else {
        handleFetchError(response.status);
      }
    } catch (error) {
      console.error("Error unliking the post:", error);
      setCommentError(
        "There are issues communicating with the server, please try again later."
      );
    }
  };

  const handleLikePress = () => {
    if (isLiked) {
      unlikePost();
    } else {
      likePost();
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

  const openCommentModal = () => {
    if (!isAuthenticated) {
      setLoginPopupVisible(true);
      return;
    }
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
            <Text className="text-xs text-lightgray">
              {" "}
              {new Date(date).toLocaleString()}
            </Text>
          </View>
        </View>

        <View className="my-2"><Text>{postContent}</Text></View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isCommentModalVisible}
        onRequestClose={closeCommentModal}
      >
        <View className="flex-1 justify-end">
          <View className="h-3/4 bg-white rounded-t-3xl p-4 shadow-lg">
            <View className="flex-row justify-between items-center pb-3 border-b border-lightgray">
              <Text className="text-lg font-bold">Kommentare</Text>
              <Pressable onPress={closeCommentModal}>
                <Ionicons name="close" size={24} color="black" />
              </Pressable>
            </View>
            <ScrollView>
              {commentError && <Text className="text-red-500">{commentError}</Text>}
              {comments.length === 0 ? (
                <Text className="text-center text-lightgray mt-4">Keine Kommentare vorhanden</Text>
              ) : (
                comments.map((comment) => (
                  <View
                    key={comment.commentId}
                    className="flex-row items-start py-3 border-b border-lightgray"
                  >
                    <Image
                      source={{ uri: comment.author.profilePictureURL }}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <View className="flex-1">
                      <Text className="font-bold">{comment.author.username}</Text>
                      <Text>{comment.content}</Text>
                      <Text className="text-xs text-lightgray">
                        {new Date(comment.creationDate).toLocaleString()}
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
                <Text className="font-bold text-sm">Posten</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isLoginPopupVisible}
        onRequestClose={() => setLoginPopupVisible(false)}
      >
        <LoginPopup />
      </Modal>
    </View>
  );
};

export default TextPostCard;
