import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Comment from "../components/types/Comment";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { SHADOWS, COLORS } from "../theme";
import { baseUrl } from "../env";
import { useAuth } from "../authentification/AuthContext";
import { useCheckAuthentication } from "../authentification/CheckAuthentification";
import ErrorComp from "./ErrorComp";
import CommentIcon from "./CommentIcon";
import LikeIcon from "./LikeIcon";
import LoginPopup from "./LoginPopup";
import { useFocusEffect } from "@react-navigation/native";
import { push } from "../navigation/NavigationService";


interface Props {
  username: string;
  profilePic: string;
  date: string; 
  initialLikes: number;
  postContent: string;
  city: string;
  postId: string;
  repostAuthor: string;
  isRepost: boolean;
  initialLiked: boolean;
}

const TextPostCard: React.FC<Props> = (props) => {
  const { token, user } = useAuth();
  const {
    username,
    postContent,
    profilePic,
    date,
    city,
    initialLikes,
    initialLiked,
    postId,
    repostAuthor,
    isRepost
    } = props;
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentError, setCommentError] = useState("");
  const isAuthenticated = useCheckAuthentication();
  const [repostError, setRepostError] = useState("");
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [isLoginPopupVisible, setIsLoginPopupVisible] = useState(false);

  useEffect(() => {
    if(token) {
      fetchComments();
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoginPopupVisible(false);
      setCommentError("");
      setRepostError("");
    }, []),
  );


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
      const data = await response.json();
      switch (response.status) {
        case 200:
          if (data) {
            setComments(data.records || []);
            setCommentError("");
          } else {
            setComments([]);
            setCommentError("");
          }
          break;
        case 401:
        case 404:
          setRepostError(data.error.message);
          break;
        default:
          setRepostError("Something went wrong, please try again later.");
          break;
      }
    } catch (error) {
      
      setCommentError(
        "There are issues communicating with the server, please try again later.",
      );
    }
  };

  const addComment = async () => {
    if (!isAuthenticated) {
      setIsLoginPopupVisible(true);
      return;
    }
    if (commentText.trim()) {
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
        
          const data = await response.json()
          switch (response.status) {
            case 201:
              if (data) {
                const formattedComment = {
                  commentId: data.commentId || `${Date.now()}`,
                  content: data.content,
                  author: {
                    username: user,
                    nickname: "",
                    profilePictureURL: "",
                  },
                  creationDate: new Date().toISOString(),
                };
                setComments([...comments, formattedComment]);
                setCommentText("");
                setCommentError("");
              }
              break;
            case 401:
            case 404:
            case 409:
              setRepostError(data.error.message)
              break;
            default:
              setRepostError("Something went wrong, please try again later.")
          }  
      } catch (error) {
        setCommentError(
          "There are issues communicating with the server, please try again later.",
        );
      }
    }
  };

  const likePost = async () => {
    if (!isAuthenticated) {
      setIsLoginPopupVisible(true);
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
      switch (response.status) {
        case 204:
          setLikes((prevLikes) => Math.max(prevLikes + 1, 0));
          setIsLiked(true);
          break;
        case 401:
        case 404:
        case 409:{
          const data = await response.json()
          setRepostError(data.error.message)
          break;
        }
        default:
          setRepostError("Something went wrong, please try again later.")
      }
    } catch (error) {
      setRepostError(
        "There are issues communicating with the server, please try again later.",
      );
    }
  };

  const unlikePost = async () => {
    if (!isAuthenticated) {
      setIsLoginPopupVisible(true);
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
      
      switch (response.status) {
        case 204:
          setLikes((prevLikes) => Math.max(prevLikes - 1, 0));
          setIsLiked(false);
          break;
        case 401:
        case 404:
        case 409:{
          const data = await response.json();
          setRepostError(data.error.message);
          break;
        }
        default:
          setRepostError("Something went wrong, please try again later.")
      }
    } catch (error) {
      setRepostError(
        "There are issues communicating with the server, please try again later.",
      );
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
    if (isLiked) {
      unlikePost();
    } else {
      likePost();
    }
  }

  const openCommentModal = () => {
    if (!isAuthenticated) {
      setIsLoginPopupVisible(true);
      return;
    }
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
        case 401:
        case 404:{
          const data = await response.json();
          setRepostError(data.error.message);
          break;
        }
        default:
          setRepostError("Something went wrong, please try again later.")
      }
    } catch (error) {
      setRepostError(
        "There are issues communicating with the server, please try again later.",
      );
    }
    setConfirmationVisible(false)
  }

  const repostConfirm = async () => {

    if (!isAuthenticated) {
      setIsLoginPopupVisible(true);
      return;
    }
    setConfirmationVisible(true);
  }    
  if(repostError !== ""){
      return <ErrorComp errorText={repostError}></ErrorComp>;
  }  else{
  return (
    <View className="items-center mx-2.5 mb-5">
      <Modal
          animationType="none"
          transparent={true}
          visible={confirmationVisible}
          onRequestClose={() => {
            setConfirmationVisible(false);
          }}
        >
          <View
            className="flex-1 justify-center items-center"
            style={{ backgroundColor: "rgba(200, 200, 200, 0.8)" }}
          >
            <View className="bg-white rounded-3xl px-8 py-4">
              <Text className="text-lg mb-10">
                Do you really want to repost this post?
              </Text>
              <View className="flex-row">
                <TouchableOpacity onPress={() => setConfirmationVisible(false)}>
                  <Text className="text-red text-base font-bold">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="ml-auto"
                  onPress={repostPost}
                >
                  <Text className="text-black text-base font-bold">Repost</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      {!isRepost ? (
      <View
        className="w-full bg-white rounded-full p-2 z-20 relative"
        style={{ ...SHADOWS.small }}
      >
        
        <View className="flex-row items-center justify-between">
          <Image
            source={require("../assets/images/Max.jpeg")}
            className="w-10 h-10 rounded-full"
            alt="PB"
          />
          <TouchableOpacity onPress={() => {
          push("GeneralProfile", { username: username })
        }} className="flex-1 ml-2">
            <Text className="font-semibold text-base">{username}</Text>
            <Text className="text-xs text-darkgray">{city}</Text>
          </TouchableOpacity>

          <View className="flex flex-col justify-end items-end">
            <View className="flex flex-row">
            <TouchableOpacity className="mr-1" onPress={repostConfirm}>
                <Ionicons
                  name="repeat-outline"
                  size={20}
                  color={COLORS.black}
                />
              </TouchableOpacity>
              <CommentIcon onPress={openCommentModal}/>
              <LikeIcon
                isLiked={isLiked}
                likes={likes}
                handleLikePress={handleLikePress}
                formatLikes={formatLikes}
              />
            </View>
            <Text className="text-xs text-darkgray mr-1">{date.split("T")[0]}</Text>
          </View>
        </View>
      </View>
      
      ) : (
        <View className="w-full bg-white rounded-xl p-2" style={{ ...SHADOWS.small }}>
          <View className="flex flex-col justify-end items-end z-20 relative" >
              <View className="flex-row items-center justify-between">
            <Image
              source={require("../assets/images/Max.jpeg")}
            className="w-10 h-10 rounded-full"
            alt="PB"
          />
          <TouchableOpacity onPress={() => {
          push("GeneralProfile", { username: username })
        }} className="flex-1 ml-2">
            <Text className="font-semibold text-base">{username}</Text>
            <Text className="text-xs text-darkgray">{city}</Text>
          </TouchableOpacity>
              <CommentIcon onPress={openCommentModal}/>
              <LikeIcon
                isLiked={isLiked}
                likes={likes}
                handleLikePress={handleLikePress}
                formatLikes={formatLikes}
              />
              </View>
              <Text className="text-xs text-darkgray mt-[-10] mb-1.5">{date.split("T")[0]}</Text>
            <View
            className="w-full bg-white rounded-full p-2 z-10 relative"
            style={{ ...SHADOWS.small }}
            >
              <View className="w-full flex-row items-center">
                <Image
                  source={require("../assets/images/Max.jpeg")}
                  className="w-10 h-10 rounded-full"
                  alt="PB"
                />
                {repostAuthor !== "" ? ( <TouchableOpacity onPress={() => {
          push("GeneralProfile", { username: repostAuthor })
        }} className="flex-1 ml-2">
            <Text className="font-semibold text-base">{repostAuthor}</Text>
            <Text className="text-xs text-darkgray">{city}</Text>
          </TouchableOpacity>) : (<View className="flex-1 ml-2">
                  <Text className="align-center font-bold">{repostAuthor}</Text>
                  <Text className="text-xs text-darkgray">{city}</Text>
                </View>)}
                <Text className="text-xs text-darkgray mt-[-12] mr-1">{date.split("T")[0]}</Text>
            </View>
          </View>
        </View>
        <View className="m-2.5 bg-secondary rounded-3xl p-5 pt-8 mt-[-20px] z-10">
            <Text>{postContent}</Text>
          </View>
        </View>
      ) }
    {!isRepost ? (
      <View className="bg-secondary w-11/12 rounded-3xl p-5 pt-8 mt-[-20px] z-10">
        <Text>{postContent}</Text>
      </View>
    ) : (<></>) }


<Modal
        animationType="slide"
        transparent={true}
        visible={isCommentModalVisible}
        onRequestClose={closeCommentModal}
      >
        {commentError !== "" ? (<ErrorComp errorText={commentError}></ErrorComp>) : (
        <View className="flex-1 justify-end">
          <View className="h-3/4 bg-white rounded-t-3xl p-4 shadow-lg">
            <View className="flex-row justify-between items-center pb-3 border-b border-darkgray">
              <Text className="text-lg font-bold">Comments</Text>
              <Pressable onPress={closeCommentModal}>
                <Ionicons name="close" size={24} color="black" />
              </Pressable>
            </View>
            <ScrollView>
              {commentError && (
                <Text className="text-red-500">{commentError}</Text>
              )}
              {comments.length === 0 ? (
                <Text className="text-center text-darkgray mt-4">
                  There are no comments yet.
                </Text>
              ) : (
                comments.map((comment) => (
                  <View
                    key={comment.commentId}
                    className="flex-row items-start py-3 border-b border-darkgray"
                  >
                    <Image
                    // { uri: comment.author.profilePictureURL || "defaultProfilePicUrl" }
                      source={require("../assets/images/Max.jpeg")}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <View className="flex-1">
                      <Text className="font-bold">
                        {comment.author.username}
                      </Text>
                      <Text>{comment.content}</Text>
                      <Text className="text-xs text-darkgray">
                        {new Date(comment.creationDate).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
            <View className="flex-row items-center border-t border-darkgray p-4">
              <TextInput
                className="flex-1 mr-4 bg-darkgray rounded-full p-3 text-sm"
                placeholder="Schreiben Sie einen Kommentar..."
                onChangeText={setCommentText}
                value={commentText}
                multiline
              />
              <TouchableOpacity
                className="bg-primary p-3 rounded-full"
                onPress={addComment}
              >
                <Text className="font-bold text-sm">Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        )}
      </Modal>
      {isLoginPopupVisible && (
        <LoginPopup setIsLoginPopupVisible={setIsLoginPopupVisible}/>
      )}
    </View>
    
  );
  }
};


export default TextPostCard;
