import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import TextPostCard from "../components/TextPostCard";
import { baseUrl } from "../env";
import Post from "../components/types/Post";

const FeedScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]); // Verwendung der Post-Schnittstelle
  const [error, setError] = useState<string | null>(null);
  const [lastPostId, setLastPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  let data;
  let response;

  const fetchPosts = async () => {
    if (loading) return;

    setLoading(true);
    const url = `${baseUrl}feed?limit=10&feedType=global`;

    try {
      response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        data = await response.json();
        const transformedPosts = data.records.map((record: any) => ({
          username: record.author.username,
          profilePic: record.author.profilePictureUrl,
          date: new Date(record.creationDate).toLocaleDateString(),
          postContent: record.content,
        }));
        setPosts((prevPosts) => [...prevPosts, ...transformedPosts]);
        setLastPostId(data.pagination.lastPostId);
      } else {
        switch (response.status) {
          case 401:
            setError("Auf das Login Popup navigieren!");
            break;
          case 404:
            setError(
              "Die Nutzer konnten nicht geladen werden. Versuche es später erneut.",
            );
            break;
          default:
            setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
        }
      }
    } catch (error) {
      setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <ScrollView className="bg-gray-200 p-2.5 my-2.5">
      {posts.map((post) => (
        <TextPostCard
          key={post.postId}
          username={post.username}
          profilePic={post.profilePic}
          date={post.date}
          postContent={post.postContent}
        />
      ))}
    </ScrollView>
  );
};

export default FeedScreen;
