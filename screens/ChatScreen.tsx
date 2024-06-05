import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useAuth } from '../authentification/AuthContext';
import { COLORS, SHADOWS } from '../theme';
import { baseUrl } from '../env';
import { navigate } from '../navigation/NavigationService';
import Chat from '../components/types/Chat';


const ChatScreen = () => {
  const { token } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    setLoading(true);
    let response;
    let data;
    try {
      response = await fetch(`${baseUrl}chats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    
      data = await response.json();
      if (data.records) {
        setChats(data.records);
      } else {
        setError('No chats found');
      }
    } catch (error) {
      setError('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchChats();
    setRefreshing(false);
  };

  const handleChatPress = (chatId: string, username: string) => {
    navigate("ChatDetail", { chatId, username });
  };

  return (
    <ScrollView
      alwaysBounceVertical={false}
      className="bg-white p-4"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text className="text-2xl font-bold mb-4">Chats</Text>
      {error && <Text className="text-red-500">{error}</Text>}
      {chats.map((chat) => (
        <TouchableOpacity
          key={chat.chatId}
          className="flex-row items-center justify-between p-2 mb-4 rounded-full bg-white"
          style={SHADOWS.small}
          onPress={() => handleChatPress(chat.chatId, chat.user.username)}
        >
          <Image
            source={{ uri: chat.user.profilePictureUrl || "defaultProfilePicUrl" }}
            className="w-12 h-12 rounded-full"
          />
          <View className="flex-1 ml-4">
            <Text className="font-bold text-base">{chat.user.username}</Text>
            <Text className="text-gray-500">{chat.lastMessage}</Text>
          </View>
          {chat.unreadMessages > 0 && (
            <View className="bg-brightBlue w-6 h-6 rounded-full flex items-center justify-center">
              <Text className="text-white text-xs">{chat.unreadMessages}</Text>
            </View>
          )}
          <Text className="text-darkgray text-xs">{chat.date}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default ChatScreen;
