import React, { useState, useEffect, useContext } from "react";
import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import TextPostCard from "../components/TextPostCard";
import { baseUrl } from "../env";
import Post from "../components/types/Post";
import ErrorComp from "../components/ErrorComp";
import { useAuth } from "../authentification/AuthContext";
import { TouchableOpacity } from "react-native-gesture-handler";

const FeedScreen = () => {
  const { login, logout } = useAuth();
  const [postsPersonal, setPostsPersonal] = useState<Post[]>([]);
  const [postsGlobal, setPostsGlobal] = useState<Post[]>([]);
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(true);

  const getPlaceName = async (latitude: number, longitude: number) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.address.city || "Unbekannte Stadt";
      }
      return "Unbekannte Stadt";
    } catch {
      return "Fehler beim Laden der Stadt";
    }
  };

  const fetchPosts = async (type: "personal" | "global") => {
    setLoading(true);
    const url = `${baseUrl}feed?limit=10&feedType=${type}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      switch (response.status) {
        case 200: {
          const updatedRecords = await Promise.all(
            data.records.map(async (record: any) => ({
              ...record,
              username: record.author?.username || "Unbekannter Nutzer",
              profilePic:
                record.author?.profilePictureUrl || "standard_pic_url",
              date: record.creationDate
                ? new Date(record.creationDate).toLocaleDateString()
                : "Unbekanntes Datum",
              postContent: record.content || "Kein Inhalt",
              city: await getPlaceName(
                record.location.latitude,
                record.location.longitude,
              ),
            })),
          );

          if (type === "personal") {
            setPostsPersonal(updatedRecords);
          } else {
            setPostsGlobal(updatedRecords);
          }
          break;
        }
        case 401:
          setErrorText(data.error.message);
          break;
        default:
          setErrorText("Something went wrong. Please try again.");
      }
    } catch (error) {
      setErrorText("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts("personal");
    fetchPosts("global");
  }, []);

  if (loading) {
    return (
      <View className="bg-white flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (postsPersonal.length !== 0 || postsGlobal.length !== 0) {
    return (
      <ScrollView className="p-4 bg-white">
        <Text className="text-lg font-bold mb-4">Persönliche Posts</Text>
        <TouchableOpacity onPress={login}>
          <Text>Login</Text>
        </TouchableOpacity>
        {postsPersonal.map((post, index) => (
          <TextPostCard
            key={`personal-${index}`}
            username={post.author.username}
            profilePic={post.author.profilePictureUrl}
            date={post.creationDate}
            postContent={post.content}
            city={post.city}
          />
        ))}

        <Text className="text-lg font-bold mt-8 mb-4">Globale Posts</Text>
        <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
        </TouchableOpacity>
        {postsGlobal.map((post, index) => (
          <TextPostCard
            key={`global-${index}`}
            username={post.author.username}
            profilePic={post.author.profilePictureUrl}
            date={post.creationDate}
            postContent={post.content}
            city={post.city}
          />
        ))}
      </ScrollView>
    );
  } else {
    return <ErrorComp errorText={errorText} />;
  }
};

export default FeedScreen;
