import { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import TextPostCard from "../components/TextPostCard";
import { baseUrl } from "../env";
import ErrorComp from "../components/ErrorComp";
import { useAuth } from "../authentification/AuthContext";
import { navigate } from "../navigation/NavigationService";
import { NativeScrollEvent } from "react-native";

const FeedScreen = () => {
  const { token } = useAuth();
  const [postsPersonal, setPostsPersonal] = useState([]);
  const [postsGlobal, setPostsGlobal] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastPostId, setLastPostId] = useState("");
  const [hasMoreGlobalPosts, setHasMoreGlobalPosts] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const globalLimit = 5;
  const personalLimit = 1000;

  useEffect(() => {
    if (token) {
      fetchPosts("personal");
    }
    fetchPosts("global");
  }, [token]);

  const fetchPosts = async (type: string) => {
    if (loading) return;
    setLoading(true);
    let url = `${baseUrl}feed?feedType=${type}`;

    if (type === "global") {
      url += `&limit=${globalLimit}`;
      if (lastPostId) {
        url += `&postId=${lastPostId}`;
      }
    } else if (type === "personal") {
      url += `&limit=${personalLimit}`;
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
          setLoadingCities(true);
          const updatedPersonalPosts = await loadCitiesForPosts(data.records);
          setLoadingCities(false);
          setPostsPersonal(updatedPersonalPosts);
        } else {
          setLoadingCities(true);
          const updatedGlobalPosts = await loadCitiesForPosts(data.records);
          setLoadingCities(false);
          setPostsGlobal((prev) => [...prev, ...updatedGlobalPosts]);
          setLastPostId(data.pagination.lastPostId);
          setHasMoreGlobalPosts(data.records.length === globalLimit);
        }
      } else {
        setErrorText(`Error fetching ${type} posts: ${response.statusText}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      setErrorText("Connection error. Please try again.");
    } finally {
      setLoading(false);
      if (type === "personal") {
        setRefreshing(false);
      }
    }
  };

  const onRefresh = () => {
    if (!token) {
      setRefreshing(false);
      return;
    }
    setRefreshing(true);
    fetchPosts("personal");
  };

  const handleScroll = ({
    nativeEvent,
  }: {
    nativeEvent: NativeScrollEvent;
  }) => {
    if (
      nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
        nativeEvent.contentSize.height - 20 &&
      hasMoreGlobalPosts &&
      !loading
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
        throw new Error(`Failed to retrieve city: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching city:", error);
      return "Unknown city";
    }
  };

  const loadCitiesForPosts = async (posts: any) => {
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
          <Text className="font-bold m-10 text-xl">Persönliche Posts</Text>
          {postsPersonal.map((post, index) => (
            <TextPostCard
              key={`personal-${index}`}
              username={post.author.username}
              profilePic={
                post.author.profilePictureUrl || "defaultProfilePicUrl"
              }
              date={post.creationDate}
              postContent={post.content}
              city={loadingCities ? "Loading city..." : post.city}
            />
          ))}
        </>
      ) : (
        <View className="flex flex-1 items-center justify-center">
          <View className="rounded-lg p-4">
            <Text>Please log in to see personal feed.</Text>
            <TouchableOpacity
              className="bg-primary py-2 px-5 rounded-lg mt-2"
              onPress={() => navigate("Authentification")}
            >
              <Text className="text-white text-base">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Text className="font-bold m-10 text-lg">Globale Posts</Text>
      {postsGlobal.map((post, index) => (
        <TextPostCard
          key={`global-${index}`}
          username={post.author.username}
          profilePic={post.author.profilePictureUrl}
          date={post.creationDate}
          postContent={post.content}
          city={loadingCities ? "Loading city..." : post.city}
        />
      ))}
      {hasMoreGlobalPosts && (
        <ActivityIndicator className="my-20 text-blue" size="small" />
      )}
      {errorText && <ErrorComp errorText={errorText} />}
    </ScrollView>
  );
};

export default FeedScreen;
