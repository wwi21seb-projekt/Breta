import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../authentification/AuthContext';
import { COLORS, SHADOWS } from '../theme';
import { baseUrl } from '../env';
import Message from '../components/types/Message';
import { navigate } from '../navigation/NavigationService';

interface RouteParams {
  username: string,
  chatId: string
}

const ChatDetailScreen = () => {
  const { token, user } = useAuth();
  const route = useRoute();
  const { chatId, username } = route.params as RouteParams;
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [messageText, setMessageText] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if(chatId !== ""){
      fetchMessages();
    }
  }, [chatId]);

  useEffect(() => {
    if(token) {
      ws.current = new WebSocket(`wss://server-beta.de/api/chat?chatId=${chatId}`, token);
      ws.current.onopen = () => {
        console.log('WebSocket connection opened');
      };
  
      ws.current.onmessage = (e: MessageEvent) => {
        const message: Message = JSON.parse(e.data);
        setMessages((prevMessages) => [...prevMessages, message]);
      };
  
      ws.current.onclose = () => {
        console.log('WebSocket connection closed');
      };
  
      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
    
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; 
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    const formattedDate = `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  }

  const getCurrentFormattedDate = () => {
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
    const microseconds = '000'; 
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${microseconds}Z`;
  
    return formattedDate;
  };

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
      if (!data?.records || !data?.pagination) {
        throw new Error('Invalid response format');
      }

      console.log(data);
      setMessages((prevMessages) => newOffset === 0 ? data.records : [...prevMessages, ...data.records]);
      setOffset(newOffset + data.pagination.records);
      setHasMore(data.pagination.records === 10);

    
    } catch (error) {
      setErrorText('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const createChat = async () => {
    let response;
    try {
      response = await fetch(`${baseUrl}chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: username,
          content: messageText
        })
      });

      const data = await response.json();
      switch (response.status) {
        case 201:
          console.log(data.message)
          //setMessages(data.message);
          break;
        case 400:
        case 401:
        case 404:
        case 409:
          setErrorText(data.error.message);
          break;
        default:
          setErrorText("Something went wrong, please try again later.");
      }
    } catch (error) {
      setErrorText("There are issues communicating with the server, please try again later.");
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
   // if (!messageText.trim()) return;
    if(messages.length == 0){
      createChat();
    } else {
      const newMessage: Message = {
        content: messageText,
        creationDate: getCurrentFormattedDate(),
        username: user || "",
      };
      if (ws.current) {
        ws.current.send(JSON.stringify(newMessage));
      }
      // setMessages([...messages, newMessage]);
      // setMessageText('');
    }
  };

  return (
    <View className="flex-1 bg-white">
      <TouchableOpacity className="flex-row items-center bg-white px-4 py-2"
      onPress={() => {
        navigate("GeneralProfile", { username: username });
      }}>
        <Image
        // { uri: "defaultProfilePicUrl" }
          source={require("../assets/images/Max.jpeg")}
          className="w-11 h-11 rounded-full"
        />
        <Text className="ml-3 font-bold text-lg">{username}</Text> 
      </TouchableOpacity>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 py-4 px-4"
          automaticallyAdjustKeyboardInsets={true}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* {loading && <Text>Loading...</Text>}
          {errorText && <Text className="text-red">{errorText}</Text>} */}
          {messages?.map((message) => (
              <View
                key={`${message.creationDate}`}
                className={`mb-4 ${message.username === user ? 'items-end self-end' : 'items-start self-start'} max-w-[60%]`}
              >
                <View
                  className={`rounded-lg px-3 py-2 ${message.username === user ? 'bg-secondary' : 'bg-lightgray'} 
                    ${message.content.length > 50 ? 'px-5 py-3' : 'px-3 py-2'}`}
                >
                  <Text className='text-sm mb-0.5'>{message.content}</Text>
                  <Text className="text-darkgray text-[10px]">{formatDate(message.creationDate)}</Text>
                </View>
              </View>
          ))}
        </ScrollView>
        <View className="px-4 py-5 bg-white">
          <View className="flex-row items-center bg-white rounded-xl p-2" style={SHADOWS.small}>
            <TextInput
              className="flex-1 p-2 mr-2"
              placeholder="Send a message ..."
              placeholderTextColor={COLORS.darkgray}
              value={messageText}
              onChangeText={setMessageText}
              multiline
              onFocus={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            />
            {/* disabled={disableSendButton || messageText === ""} */}
            <TouchableOpacity className="bg-primary py-2 px-3 rounded-full" onPress={sendMessage}>
              <Text className="text-white">Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatDetailScreen;
