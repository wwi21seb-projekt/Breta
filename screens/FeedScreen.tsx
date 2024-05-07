import React, { useState, useEffect } from "react";
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

const FeedScreen = () => {
  const { token } = useAuth();
  const [postsPersonal, setPostsPersonal] = useState([]);
  const [postsGlobal, setPostsGlobal] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastPostId, setLastPostId] = useState("");
  const [hasMoreGlobalPosts, setHasMoreGlobalPosts] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false); // State for loading cities
  const globalLimit = 5;
  const personalLimit = 1000;

  useEffect(() => {
    if (token) {
      fetchPosts("personal");
    }
    fetchPosts("global");
  }, [token]);

  const fetchPosts = async (type) => {
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
          setLoadingCities(true); // Set loading cities to true before loading cities
          const updatedPersonalPosts = await loadCitiesForPosts(data.records);
          setLoadingCities(false); // Set loading cities to false after loading cities
          setPostsPersonal(updatedPersonalPosts);
        } else {
          setLoadingCities(true); // Set loading cities to true before loading cities
          const updatedGlobalPosts = await loadCitiesForPosts(data.records);
          setLoadingCities(false); // Set loading cities to false after loading cities
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

  const handleScroll = ({ nativeEvent }) => {
    if (
      nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
        nativeEvent.contentSize.height - 20 &&
      hasMoreGlobalPosts &&
      !loading
    ) {
      fetchPosts("global");
    }
  };

  const getCityFromCoordinates = async (latitude, longitude) => {
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

  const loadCitiesForPosts = async (posts) => {
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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      {token ? (
        <>
          <Text style={{ fontWeight: "bold", margin: 10, fontSize: 18 }}>
            Persönliche Posts
          </Text>
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
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View style={{ borderRadius: 8, padding: 16 }}>
            <Text>Please log in to see personal feed.</Text>
            <TouchableOpacity
              style={{
                backgroundColor: "blue",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 20,
                marginTop: 10,
              }}
              onPress={() => navigate("Authentification")}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Text style={{ fontWeight: "bold", margin: 10, fontSize: 18 }}>
        Globale Posts
      </Text>
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
        <ActivityIndicator
          style={{ marginVertical: 20 }}
          size="small"
          color="#0000ff"
        />
      )}
      {errorText && <ErrorComp errorText={errorText} />}
    </ScrollView>
  );
};

export default FeedScreen;
