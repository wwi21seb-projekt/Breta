import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../authentification/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../theme';
import { baseUrl } from '../env';
import Message from '../components/types/Message';

interface RouteParams {
  username: string,
  chatId: string
}

const ChatDetailScreen = () => {
  const { token } = useAuth();
  const route = useRoute();
  const { chatId, username } = route.params as RouteParams;
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messageText, setMessageText] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  const fetchMessages = async (newOffset = 0) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}chats/${chatId}?offset=${newOffset}&limit=10`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
  
      const data = await response.json();
      if (!data || !data.records || !data.pagination) {
        throw new Error('Invalid response format');
      }

      setMessages((prevMessages) => newOffset === 0 ? data.records : [...prevMessages, ...data.records]);
      setOffset(newOffset + data.pagination.records);
      setHasMore(data.pagination.records === 10);

    
    } catch (error) {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleScroll = (event: any) => {
    if (event.nativeEvent.contentOffset.y === 0 && hasMore && !loading) {
      fetchMessages(offset);
    }
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: `${Date.now()}`, 
      content: messageText,
      sender: { username: 'Ich' },
      date: new Date().toLocaleString(),
    };
    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center bg-white p-4">
        <Image
          source={{ uri: "defaultProfilePicUrl" }}
          className="w-10 h-10 rounded-full"
        />
        <Text className="ml-4 font-bold text-lg">{username}</Text> 
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 py-4 px-4"
          contentContainerStyle={{ paddingBottom: 20 }}
          automaticallyAdjustKeyboardInsets={true}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {loading && <Text>Loading...</Text>}
          {error && <Text className="text-red">{error}</Text>}
          {messages && messages.map((message) => {
            const isMyMessage = message.sender && message.sender.username === 'Ich';
            return (
              <View
                key={`${message.id}-${message.date}`}
                className={`mb-4 ${isMyMessage ? 'items-end self-end' : 'items-start self-start'} max-w-[50%]`}
              >
                <View
                  className={`rounded-lg px-3 py-2 ${isMyMessage ? 'bg-secondary' : 'bg-lightgray'} 
                    ${message.content.length > 50 ? 'px-5 py-3' : 'px-3 py-2'}`}
                >
                  <Text className='text-md'>{message.content}</Text>
                  <Text className="text-darkgray text-xs">{message.date}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <View className="p-4 bg-white">
          <View className="flex-row items-center bg-white rounded-xl p-2" style={SHADOWS.small}>
            <TextInput
              className="flex-1 p-2 mr-2"
              placeholder="Schreibe eine Nachricht..."
              placeholderTextColor={COLORS.darkgray}
              value={messageText}
              onChangeText={setMessageText}
              multiline
              onFocus={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            />
            <TouchableOpacity className="bg-primary p-2 rounded-full" onPress={sendMessage}>
              <Text className="text-white">Senden</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatDetailScreen;
