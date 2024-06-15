import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity
} from "react-native";
import TextPostCard from "../components/TextPostCard";
import { baseUrl } from "../env";
import ErrorComp from "../components/ErrorComp";
import { useAuth } from "../authentification/AuthContext";
import { navigate } from "../navigation/NavigationService";
import { NativeScrollEvent } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Post from "../components/types/Post";

const FeedScreen = () => {
  const { token } = useAuth();
  const [postsPersonal, setPostsPersonal] = useState<Post[]>([]);
  const [postsGlobal, setPostsGlobal] = useState<Post[]>([]);
  const [errorText, setErrorText] = useState("");
  const [loadingPersonalFeed, setLoadingPersonalFeed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMoreGlobalPosts, setHasMoreGlobalPosts] = useState(true);
  const [lastGlobalPostId, setLastGlobalPostId] = useState("");
  const globalLimit = 5;

  useEffect(() => {
    setErrorText("");
    if (token) {
      fetchPosts("personal");
    }
    fetchPosts("global");
  }, [token]);

  useFocusEffect(
    React.useCallback(() => {
      setErrorText("");
    }, []),
  );

  const fetchPosts = async (type: string) => {
    let url = `${baseUrl}feed?feedType=${type}`;

    if (type === "global") {
      url += `&limit=${globalLimit}`;
      if (lastGlobalPostId !== "") {
        url += `&postId=${lastGlobalPostId}`;
      }
    } 
  
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
        if (type === "personal") {
          setLoadingPersonalFeed(true);
          const updatedPersonalPosts = await loadCitiesForPosts(data.records);
          setPostsPersonal(updatedPersonalPosts);
          setLoadingPersonalFeed(false);
        } else{
          const updatedGlobalPosts = await loadCitiesForPosts(data.records);
          setPostsGlobal((prev) => [...prev, ...updatedGlobalPosts]);
          setLastGlobalPostId(data.pagination.lastPostId);
          setHasMoreGlobalPosts(postsGlobal.length < data.pagination.records);
        }
      } else {
        setErrorText("Something went wrong, please try again later.");
      }
    } catch (error) {
      setErrorText(
        "There are issues communicating with the server, please try again later.");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setErrorText("");
    if (token) {
      fetchPosts("personal");
    }
    fetchPosts("global");
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleScroll = ({
    nativeEvent,
  }: {
    nativeEvent: NativeScrollEvent;
  }) => {
    if (
      nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
        nativeEvent.contentSize.height - 20 && hasMoreGlobalPosts
    ) {
      fetchPosts("global");
    }
  };

  const getCityFromCoordinates = async (latitude: any, longitude: any) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=de`,
      );
      if (response.ok) {
        const data = await response.json();
        return data.city;
        
      } else {
        return "Unknown city";
      }
    } catch (error) {
      return "Unknown city";
    }
  };

  const loadCitiesForPosts = async (posts: Post[]) => {
    const updatedPosts = [];
    for (const post of posts) {
      if (post.location && post.location.latitude && post.location.longitude) {
        const city = await getCityFromCoordinates(
          post.location.latitude,
          post.location.longitude,
        );
        updatedPosts.push({ ...post, city });
      } else {
        updatedPosts.push(post);
      }
    }
    return updatedPosts;
  };
  
  if (errorText) {
    return <ErrorComp errorText={errorText}></ErrorComp>;
  } else {
  return (
    <ScrollView
      className="bg-white"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      {token ? (
        <>
          <Text className="font-bold m-6 text-lg">Personal Feed</Text>
          {postsPersonal.map((post, index) => (
            <TextPostCard
              key={`personal-${index}`}
              username={post.author.username}
              // post.author.picture.url
              profilePic={"url"}
              date={post.creationDate}
              postContent={post.content}
              city={post.city}
              postId={post.postId}
              repostAuthor={post.repost?.author?.username || ""}
              isRepost={post.repost !== null}
              initialLikes={post.likes}
              initialLiked={post.liked}
              isOwnPost={false}
            />
          ))}
          {loadingPersonalFeed && (
          <ActivityIndicator className="mb-8" size="small" />
        )}
        </>
      ) : (
        <View className="flex items-center justify-center">
          <View className="rounded-lg p-3">
            <Text className="text-base mb-2">Please login to see your personal feed.</Text>
            <TouchableOpacity
              className="bg-primary py-2 px-7 mx-auto rounded-lg"
              onPress={() => navigate("Authentification")}
            >
              <Text className="text-white text-base text-center">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    <Text className="font-bold m-6 text-lg">Global Feed</Text>
        {postsGlobal.map((post, index) => (
          <TextPostCard
            key={`global-${index}`}
            username={post.author.username}
            // post.author.picture.url
            profilePic={""}
            date={post.creationDate}
            postContent={post.content}
            city={post.city}
            postId={post.postId}
            repostAuthor={post.repost?.author?.username || ""}
            isRepost={post.repost !== null}
            initialLikes={post.likes}
            initialLiked={post.liked}
            isOwnPost={false}
          />
        ))}
        {hasMoreGlobalPosts && (
          <ActivityIndicator className="mb-8" size="small" />
        )}    
    </ScrollView>
  );
};
}

export default FeedScreen;
