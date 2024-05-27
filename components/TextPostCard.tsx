import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Comment from "../components/types/Comment";
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
import { useAuth } from "../authentification/AuthContext";
import { useCheckAuthentication } from "../authentification/CheckAuthentification";
import ErrorComp from "./ErrorComp";
import CommentIcon from "./CommentIcon";
import LikeIcon from "./LikeIcon";

const windowHeight = Dimensions.get("window").height;


interface Props {
  username: string;
  profilePic: string;
  date: string; 
  initialLikes: number;
  postContent: string;
  style?: React.CSSProperties;
  city: string;
  postId: string;
  repostAuthor?: string;
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
  const [isLoginPopupVisible, setLoginPopupVisible] = useState(false);
  const [repostError, setRepostError] = useState("")

  useEffect(() => {
    if(token) {
      fetchComments();
    }
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
      setLoginPopupVisible(true);
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
        
        if (response.ok) {
          const text = await response.text();
          if (text) {
            const addedComment = JSON.parse(text);
            const formattedComment = {
              commentId: addedComment.commentId || `${Date.now()}`,
              content: addedComment.content,
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
        } else {
          const data = await response.json()
          switch (response.status) {
            case 401:
            case 404:
            case 409:
              setRepostError(data.error.message)
              break;
            default:
              setRepostError("Something went wrong, please try again later.")
          }
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
      
      switch (response.status) {
        case 204:
          setLikes((prevLikes) => Math.max(prevLikes - 1, 0));
          setIsLiked(false);
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
      setLoginPopupVisible(true);
      return;
    }
    setCommentModalVisible(true);
  };

  const closeCommentModal = () => {
    setCommentModalVisible(false);
  };

  const repostPost =  async () => {
    if (!isAuthenticated) {
      setLoginPopupVisible(true);
      return;
    }
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
  }
    
  


  if(repostError !== ""){
      return <ErrorComp errorText={repostError}></ErrorComp>;
  }  else{
  return (
    <View className="items-center mx-2.5 mb-5">
      {!isRepost ? (
      <View
        className="w-full bg-white rounded-full p-4 z-20 relative"
        style={{ ...SHADOWS.small }}
      >
        <View className="flex-row items-center justify-between">
          <Image
            source={{ uri: profilePic || "defaultProfilePicUrl" }}
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
              <CommentIcon onPress={openCommentModal}/>
              <LikeIcon
                isLiked={isLiked}
                likes={likes}
                handleLikePress={handleLikePress}
                formatLikes={formatLikes}
              />
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
              <CommentIcon onPress={openCommentModal}/>
              <LikeIcon
                isLiked={isLiked}
                likes={likes}
                handleLikePress={handleLikePress}
                formatLikes={formatLikes}
              />
              </View>,
              <Text className="text-xs text-lightgray text-l mt-[-14] mb-1"> {date.split("T")[0]}</Text>
            <View
            className="w-full bg-white rounded-full p-4 z-10 relative"
            style={{ ...SHADOWS.small }}
            >
              <View className="w-full flex-row items-center">
                <Image
                  source={{ uri: profilePic|| "defaultProfilePicUrl" }}
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
        animationType="slide"
        transparent={true}
        visible={isCommentModalVisible}
        onRequestClose={closeCommentModal}
      >
        {commentError !== "" ? (<ErrorComp errorText={commentError}></ErrorComp>) : (
        <View className="flex-1 justify-end">
          <View className="h-3/4 bg-white rounded-t-3xl p-4 shadow-lg">
            <View className="flex-row justify-between items-center pb-3 border-b border-lightgray">
              <Text className="text-lg font-bold">Kommentare</Text>
              <Pressable onPress={closeCommentModal}>
                <Ionicons name="close" size={24} color="black" />
              </Pressable>
            </View>
            <ScrollView>
              {commentError && (
                <Text className="text-red-500">{commentError}</Text>
              )}
              {comments.length === 0 ? (
                <Text className="text-center text-lightgray mt-4">
                  Keine Kommentare vorhanden
                </Text>
              ) : (
                comments.map((comment) => (
                  <View
                    key={comment.commentId}
                    className="flex-row items-start py-3 border-b border-lightgray"
                  >
                    <Image
                      source={{ uri: comment.author.profilePictureURL || "defaultProfilePicUrl" }}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <View className="flex-1">
                      <Text className="font-bold">
                        {comment.author.username}
                      </Text>
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
        )}
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLoginPopupVisible}
        onRequestClose={() => setLoginPopupVisible(false)}
      >
        <LoginPopup/>
      </Modal>
    </View>
  );
  }
};


export default TextPostCard;
