import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useAuth } from '../authentification/AuthContext';
import {  SHADOWS } from '../theme';
import { navigate } from '../navigation/NavigationService';
import Chat from '../components/types/Chat';
import ErrorComp from "../components/ErrorComp";
import { loadChats } from '../components/functions/LoadChats';
import { useFocusEffect } from "@react-navigation/native";

const ChatScreen = () => {
  const { token } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [areNoChats, setAreNoChats] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Load chats when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setErrorText("");
      setAreNoChats(false);
      loadChats(setChats, setErrorText, setAreNoChats, token);
    }, [token])
  );

  // Refresh the chat list
  const onRefresh = async () => {
    setRefreshing(true);
    setErrorText("");
    await loadChats(setChats, setErrorText, setAreNoChats, token);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Handle chat press
  const handleChatPress = (chatId: string, username: string, pictureUrl: string) => {
    if(pictureUrl === undefined) {
      pictureUrl = "";
    }
    navigate("ChatDetail", { chatId, username, pictureUrl });
  };

  // Render error component if there's an error
  if (errorText) {
    return (
      <ErrorComp errorText={errorText} />
    );
  } else {
    // Main render
    return (
      <ScrollView
        alwaysBounceVertical={false}
        className="bg-white p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text className="text-2xl font-bold mb-4">Chats</Text>
        {areNoChats && (<Text className="text-lightgray text-base">You do not have any chats so far.</Text>)}
        {chats.map((chat) => (
          <TouchableOpacity
            key={chat.chatId}
            className="flex-row items-center justify-between p-1.5 mb-4 rounded-full bg-white"
            style={SHADOWS.small}
            onPress={() => handleChatPress(chat.chatId, chat.user.username, chat.user?.picture?.url)}
          >
            <Image
              source={{ uri: chat.user?.picture?.url || "defaultProfilePicUrl" }}
              className="w-11 h-11 rounded-full"
            />
            <Text className="flex-1 ml-3 font-bold">{chat.user.username}</Text>
          </TouchableOpacity>
        ))}
        <View className="mt-8"></View>
      </ScrollView>
    );
  }
};

export default ChatScreen;
