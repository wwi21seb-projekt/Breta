import React, { useState } from "react";
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
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  NativeScrollEvent
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
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

interface Props {
  username: string;
  profilePic: string;
  date: string; 
  initialLikes: number;
  postContent: string;
  repostPostContent: string;
  picture: string;
  repostPostPicture: string;
  city?: string;
  repostCity?: string;
  postId: string;
  repostAuthor: string;
  repostPicture: string
  isRepost: boolean;
  initialLiked: boolean;
  isOwnPost: boolean;
}

const TextPostCard: React.FC<Props> = (props) => {
  const { token, user } = useAuth();
  const {
    username,
    postContent,
    profilePic,
    date,
    city,
    repostCity,
    initialLikes,
    initialLiked,
    postId,
    repostAuthor,
    repostPicture,
    isRepost,
    isOwnPost,
    picture,
    repostPostPicture,
    repostPostContent
    } = props;

  // State variables
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentError, setCommentError] = useState("");
  const isAuthenticated = useCheckAuthentication();
  const [repostError, setRepostError] = useState("");
  const [repostText, setRepostText] = useState("");
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [isLoginPopupVisible, setIsLoginPopupVisible] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [offset, setOffset] = useState(0);
  
  // Reset error and popup states when the component is focused
  useFocusEffect(
    React.useCallback(() => {
      setIsLoginPopupVisible(false);
      setCommentError("");
      setRepostError("");
    }, []),
  );

  // Helper function to highlight hashtags in a text
  const checkForHashtag = (text: string) => {
    if(!text){
      return
    }
    const hashtagRegex = /#(\w+)/g;
    const segments = text.split(hashtagRegex);

    const coloredText = segments.map((segment, index) => {
      if (index % 2 === 1) {
        return (
          <Text key={index} className="text-brigtBlue">
            #{segment}
          </Text>
        );
      } else {
        return segment;
      }
    });
    return <>{coloredText}</>;
  };
  
  // Handler for infinite scroll to load more comments
  const handleCommentScroll = ({
    nativeEvent,
  }: {
    nativeEvent: NativeScrollEvent;
  }) => {
    if (
      nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
        nativeEvent.contentSize.height - 20 && hasMoreComments
    ) {
      fetchComments(true);
    }
  };

  // Fetch comments from the server
  const fetchComments = async (loadMore: boolean) => {
    setLoadingComments(true);
    let newOffset = loadMore ? offset + 8 : 0;
    const url = `${baseUrl}posts/${postId}/comments?limit=8&offset=${newOffset}`;
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
            setComments(loadMore ? [...comments, ...data.records] : data.records || []);
            setOffset(newOffset);
            setHasMoreComments(data.pagination.records - data.pagination.offset > 8);
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
    } finally {
      setLoadingComments(false);
    }
  };

  // Add a new comment
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
                    picture: {
                      url: ""
                    }
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

  // Like the post
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

  // Unlike the post
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
  
  // Format the like count for display
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

  // Handle like button press
  const handleLikePress = () => {
    if (isLiked) {
      unlikePost();
    } else {
      likePost();
    }
  }

  // Open the comment modal
  const openCommentModal = () => {
    if (!isAuthenticated) {
      setIsLoginPopupVisible(true);
      return;
    }
    fetchComments(false);
    setCommentModalVisible(true);
  };

  // Close the comment modal
  const closeCommentModal = () => {
    setCommentModalVisible(false);
  };

  // Repost a post
  const repostPost =  async () => {
    
    let response;
    let base64;

    if(image !== ''){
      base64 = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }

    try {
      response = await fetch(`${baseUrl}posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          repostedPostId: postId,
          content: repostText,
          picture: picture === '' ? "" : base64,
          repostPostPicture: image === '' ? "" : base64,

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

  // Show confirmation before reposting
  const repostConfirm = async () => {

    if (!isAuthenticated) {
      setIsLoginPopupVisible(true);
      return;
    }
    setConfirmationVisible(true);
  }    

  // Pick an image from the gallery
  const [image, setImage] = useState('');
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Remove the selected image
  const removeImage = () => {
    setImage('');
  }

  // Render the component
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
            <View className="bg-white rounded-3xl">
              <Text className="text-base my-3 mx-2.5">
                Do you really want to repost this post?
              </Text>
              
              <View className="bg-white justify-center flex-row">
                  <TextInput
                    className="flex-1 border-2 mx-2.5 border-lightgray rounded-[8px] p-2 "
                    value={repostText}
                    onChangeText={(post) => {
                      setRepostText(post);
                    }}
                    multiline={true}
                    numberOfLines={4}
                    placeholder="Please put your text here..."
                    placeholderTextColor={COLORS.lightgray}
                    maxLength={256}
                  />
              </View>
              <View className="mt-6 items-center">
                <TouchableOpacity onPress={pickImage}>
                  {image !== '' ? (
              <Image className="w-72 h-72 mb-1"source={{ uri: image }}/>
                ) : (
              <Image className="w-72 h-72 mb-1" source={require("../assets/images/image_placeholder.jpeg")}/>
            )}
                </TouchableOpacity>
              </View>
              {image !== '' && (
                  <TouchableOpacity
                  className="ml-2.5"
                  onPress={() => {
                    removeImage();
                  }}
                >
                  <Text className="text-black text-sm">Remove Image</Text>
                </TouchableOpacity>
                )}
              <View className="flex-row mt-5 mx-2.5 mb-3">
                <TouchableOpacity onPress={() => setConfirmationVisible(false)}>
                  <Text className="text-red text-base font-bold">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="ml-auto"
                  onPress={repostPost}
                >
                  <Text className="text-black text-base font-bold">Create Repost</Text>
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
          {!isOwnPost ? (<>{profilePic !== "" && <Image
            source={{uri: profilePic || "defaultProfilePic"}}
            className="w-10 h-10 rounded-full"
            alt="PB"
          />}
          <TouchableOpacity disabled={!isAuthenticated} onPress={() => {
          push("GeneralProfile", { username: username })
        }} className="flex-1 ml-2">
            <Text className="font-semibold text-base">{username}</Text>
            <Text className="text-xs text-darkgray">{city}</Text>
          </TouchableOpacity></>) : (<View className="flex-col"><Text className="text-xs text-darkgray ml-1 font-semibold">{city}</Text><Text className="text-xs text-darkgray ml-1">{date.split("T")[0]}</Text>
        </View>)}
          

          <View className="flex flex-col justify-end items-end">
            <View className="flex flex-row">
              {!isOwnPost && (<TouchableOpacity className="mr-1" onPress={repostConfirm}>
                <Ionicons
                  name="repeat-outline"
                  size={20}
                  color={COLORS.black}
                />
              </TouchableOpacity>)}
              <CommentIcon onPress={openCommentModal}/>
              <LikeIcon
                isLiked={isLiked}
                likes={likes}
                handleLikePress={handleLikePress}
                formatLikes={formatLikes}
              />
            </View>
            {!isOwnPost && (<Text className="text-xs text-darkgray mr-1">{date.split("T")[0]}</Text>)}
          </View>
        </View>
      </View>
      
      ) : (
        <View className="w-full bg-white rounded-xl p-2" style={{ ...SHADOWS.small }}>
          <View className="flex flex-col justify-end items-end z-20 relative" >
              <View className="flex-row items-center justify-between">
              {!isOwnPost ? (<>{profilePic !== "" && <Image
            source={{uri: profilePic || "defaultProfilePic"}}
            className="w-10 h-10 rounded-full"
            alt="PB"
          />}
          <TouchableOpacity disabled={!isAuthenticated} onPress={() => {
          push("GeneralProfile", { username: username })
        }} className="flex-1 ml-2">
            <Text className="font-semibold text-base">{username}</Text>
            <Text className="text-xs text-darkgray">{city}</Text>
          </TouchableOpacity></>) : (<Text className="mb-1.5 text-xs flex-1 ml-1"><Text className="font-semibold italic text-darkgray text-sm">Reposted</Text> on {date.split("T")[0]}</Text>)}
           
              <CommentIcon onPress={openCommentModal}/>
              <LikeIcon
                isLiked={isLiked}
                likes={likes}
                handleLikePress={handleLikePress}
                formatLikes={formatLikes}
              />
              </View>
              {!isOwnPost && (<Text className="text-xs text-darkgray mt-[-10] mb-1.5">{date.split("T")[0]}</Text>)}
            <View
            className="w-full bg-white rounded-full p-2 z-10 relative"
            style={{ ...SHADOWS.small }}
            >
              <View className="w-full flex-row items-center">
              {repostPicture !== "" && <Image
            source={{uri: repostPicture || "defaultProfilePic"}}
            className="w-10 h-10 rounded-full"
            alt="PB"
          />}
                {repostAuthor !== "" ? ( <TouchableOpacity disabled={!isAuthenticated} onPress={() => {
          push("GeneralProfile", { username: repostAuthor })
        }} className="flex-1 ml-2">
            <Text className="font-semibold text-base">{repostAuthor}</Text>
            {!isOwnPost ? (<Text className="text-xs text-darkgray">{repostCity}</Text>) : (<Text className="text-xs text-darkgray mt-[-2]">{date.split("T")[0]}</Text>)}
          </TouchableOpacity>) : (<View className="flex-1 ml-2">
                  <Text className="align-center font-bold">{repostAuthor}</Text>
                  {!isOwnPost ? (<Text className="text-xs text-darkgray">{repostCity}</Text>) : (<Text className="text-xs text-darkgray mt-[-2]">{date.split("T")[0]}</Text>)}
                </View>)}
                {!isOwnPost && (<Text className="text-xs text-darkgray mt-[-12] mr-1">{date.split("T")[0]}</Text>)}
            </View>
          </View>
        </View>
        <View className="m-2.5 bg-secondary rounded-3xl pt-8 mt-[-20px] z-10">
  {repostPostPicture !== "" ? (
    <View> 
      <Image
        source={{ uri: repostPostPicture || "defaultProfilePic" }}
        className="h-72 mt-[-20px] rounded-t-3xl"
      />
    </View>
  ) : null}
  {repostPostContent !== "" && (
    <Text className="my-3 mx-5">{checkForHashtag(repostPostContent)}</Text>
  )}
</View>
<View style={{ ...SHADOWS.small }} className="w-40 h-1 rounded-full my-4 ml-28 bg-lightgray"></View>
<View className="bg-secondary rounded-3xl z-10">
  {picture !== "" ? (
    <Image
      source={{ uri: picture || "defaultProfilePic" }}
      className={`h-72 ${postContent === "" ? "rounded-3xl" : "rounded-t-3xl"}`}
    />
  ) : null}
  {postContent !== "" && (
    <Text className="my-3 mx-5">{checkForHashtag(postContent)}</Text>
  )}
</View>


        </View>
      ) }
    {!isRepost && (
  <View className="bg-secondary w-11/12 rounded-3xl pt-8 mt-[-20px] z-10">
    {picture != "" && (
      <View > 
      <Image
        source={{ uri: picture || "defaultProfilePic" }}
        className={`h-72 mt-[-20px] ${postContent === "" ? "rounded-b-3xl" : "rounded-t-3xl"}`}
            /> 
            </View> )}
            {postContent !== "" && (<Text className="my-3 mx-5">{checkForHashtag(postContent)}</Text>)}
    
    
  </View>
)}


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
              <Text className="text-lg font-bold">Comments</Text>
              <Pressable onPress={closeCommentModal}>
                <Ionicons name="close" size={24} color="black" />
              </Pressable>
            </View>
            <ScrollView
            onScroll={handleCommentScroll}
            scrollEventThrottle={16}
            alwaysBounceVertical={false} >
              {commentError && (
                <Text className="text-red">{commentError}</Text>
              )}
              {comments.length === 0 ? (
                <Text className="text-center text-darkgray mt-4">
                  There are no comments yet.
                </Text>
              ) : (
                comments.map((comment) => (
                  <View
                    key={comment.commentId}
                    className="flex-row items-start py-3 border-b border-lightgray"
                  >
                    <Image
                      source={{ uri: comment.author?.picture?.url || "defaultProfilePicUrl" }}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <View className="flex-1">
                    <TouchableOpacity onPress={() => {closeCommentModal();
          push("GeneralProfile", { username: comment.author.username !== null ?  comment.author.username : ""})
        }}>
             <Text className="text-md font-bold mb-1.5">
                        {comment.author.username}
                      </Text>
          </TouchableOpacity>
                      <Text className="text-sm mb-0.5">{checkForHashtag(comment.content)}</Text>
                      <Text className="text-xs text-darkgray">
                        {new Date(comment.creationDate).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                ))
              )}
              {loadingComments && (
          <ActivityIndicator className="mb-2" size="small" />
        )}
            </ScrollView>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 220 : 0} className="p-2 bg-white">
          <View className="flex-row items-center bg-white rounded-xl p-2" style={SHADOWS.small}>
            <TextInput
              className="flex-1 p-2 mr-2"
              placeholder="Write a comment..."
              placeholderTextColor={COLORS.darkgray}
                onChangeText={setCommentText}
                value={commentText}
                multiline
            />
            <TouchableOpacity className="bg-primary py-2 px-4 rounded-full" style={{
                backgroundColor: commentText
                  ? COLORS.primary
                  : COLORS.lightgray,
              }} onPress={addComment} disabled={!commentText}>
              <Text className="text-white">Post</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
          </View>
        </View>
        )}
      </Modal>
      {isLoginPopupVisible && (
        <LoginPopup setIsLoginPopupVisible={setIsLoginPopupVisible} type={""}/>
      )}
    </View>
    
  );
  }
};

export default TextPostCard;
