import React, { useState, useEffect } from "react";
import { ScrollView, Text } from "react-native";
import TextPostCard from "../components/TextPostCard";
import { baseUrl } from "../env";
import Post from "../components/types/Post";

const FeedScreen = () => {
  const [postsPersonal, setPostsPersonal] = useState<Post[]>([]);
  const [postsGlobal, setPostsGlobal] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

      if (!response.ok) {
        setError("Daten konnten nicht geladen werden");
      }

      const data = await response.json();
      const updatedRecords = await Promise.all(
        data.records.map(async (record: any) => ({
          ...record,
          username: record.author?.username || "Unbekannter Nutzer",
          profilePic: record.author?.profilePictureUrl || "standard_pic_url",
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
    } catch (error) {
      setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts("personal");
    fetchPosts("global");
  }, []);

  return (
    <ScrollView className="p-4 bg-white">
      <Text className="text-lg font-bold mb-4">Persönliche Posts</Text>
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

      {error && <Text className="text-red text-center">{error}</Text>}
    </ScrollView>
  );
};

export default FeedScreen;
