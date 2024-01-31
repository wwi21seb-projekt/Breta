import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import TextPostCard from '../components/TextPostCard';
import { baseUrl } from "../env";
import Post from "../components/types/Post";

const FeedScreen = () => {
  const [postsPersonal, setPostsPersonal] = useState<Post[]>([]);
  const [postsGlobal, setPostsGlobal] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (type) => {
    setLoading(true);
    const url = `${baseUrl}feed?limit=10&feedType=${type}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error('Daten konnten nicht geladen werden');
      }

      const data = await response.json();
      return data.records.map((record) => ({
        username: record.author?.username || 'Unbekannter Nutzer',
        profilePic: record.author?.profilePictureUrl || 'standard_pic_url',
        date: record.creationDate ? new Date(record.creationDate).toLocaleDateString() : 'Unbekanntes Datum',
        postContent: record.content || 'Kein Inhalt'
      }));
    } catch (error) {
      setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      setPostsPersonal(await fetchPosts('personal'));
      setPostsGlobal(await fetchPosts('global'));
    })();
  }, []);

  return (
    <ScrollView className='bg-gray-200 p-4'>
      <Text className='text-lg font-bold mb-4'>Persönliche Posts</Text>
      {postsPersonal.map((post, index) => (
        <TextPostCard
          key={`personal-${index}`}
          username={post.username}
          profilePic={post.profilePic}
          date={post.date}
          postContent={post.postContent}
        />
      ))}

      <Text className='text-lg font-bold mt-8 mb-4'>Globale Posts</Text>
      {postsGlobal.map((post, index) => (
        <TextPostCard
          key={`global-${index}`}
          username={post.username}
          profilePic={post.profilePic}
          date={post.date}
          postContent={post.postContent}
        />
      ))}

      {error && <Text className='text-red-500 text-center'>{error}</Text>}
    </ScrollView>
  );
};

export default FeedScreen;
