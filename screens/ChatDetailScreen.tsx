import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ActivityIndicator, Keyboard } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../authentification/AuthContext';
import { COLORS, SHADOWS } from '../theme';
import { baseUrl, baseSocketUrl } from '../env';
import Message from '../components/types/Message';
import { navigate } from '../navigation/NavigationService';
import ErrorComp from '../components/ErrorComp';

interface RouteParams {
  username: string,
  chatId: string,
  pictureUrl: string,
}

const ChatDetailScreen = () => {
  const { token, user } = useAuth();
  const route = useRoute();
  const { chatId, username, pictureUrl } = route.params as RouteParams;

  // State variables
  const [currentChatId, setCurrentChatId] = useState(chatId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [disableSendButton, setDisableSendButton] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [messageText, setMessageText] = useState("");

  // Refs for ScrollView and WebSocket
  const scrollViewRef = useRef<ScrollView>(null);
  const ws = useRef<WebSocket | null>(null);

  // Effect to fetch messages and initialize WebSocket connection
  useEffect(() => {
    if (chatId === "") {
      setDisableSendButton(false);
    }
    if (token && currentChatId !== "") {
      fetchMessages();
      ws.current = new WebSocket(`${baseSocketUrl}chat?chatId=${currentChatId}`, token);
      ws.current.onopen = () => {
        setDisableSendButton(false);
      };
      ws.current.onmessage = (e: MessageEvent) => {
        const message: Message = JSON.parse(e.data);
        setMessages((prevMessages) => [...prevMessages, message]);
      };
      ws.current.onclose = () => {
        setDisableSendButton(true);
      };
      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  }, [currentChatId]);

  // Effect to scroll to the end of messages when a new message is received
  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages]);

  // Handle message text change
  const handleMessageChange = (text: string) => {
    if (text.length <= 256) {
      setMessageText(text);
    }
  };

  // Format date for message display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getUTCDate()}.${date.getUTCMonth() + 1}.${date.getUTCFullYear()}, ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`;
    return formattedDate;
  }

  // Get the current formatted date
  const getCurrentFormattedDate = () => {
    const date = new Date();
    return date.toISOString();
  };

  // Fetch chat messages from the server
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}chats/${currentChatId}?offset=0&limit=50`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      switch (response.status) {
        case 200:
          setMessages(data.records.reverse());
          break;
        case 401:
        case 404:
          setErrorText(data.error.message);
          break;
        default:
          setErrorText("Something went wrong, please try again later.");
      }
    } catch (error) {
      setErrorText("There are issues communicating with the server, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Create a new chat
  const createChat = async () => {
    try {
      const response = await fetch(`${baseUrl}chats`, {
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
          setMessages((prevMessages) => [...prevMessages, data.message]);
          setCurrentChatId(data.chatId);
          setMessageText("");
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

  // Send a new message
  const sendMessage = () => {
    if (messages.length == 0) {
      createChat();
    } else {
      const newMessage: Message = {
        content: messageText.trim(),
        creationDate: getCurrentFormattedDate(),
        username: user || "",
      };
      if (ws.current) {
        ws.current.send(JSON.stringify(newMessage));
      }
      setMessageText("");
      Keyboard.dismiss(); 
    }
  };

  // Render loading indicator or error component if needed
  if (loading) {
    return (
      <View className="bg-white flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (errorText) {
    return <ErrorComp errorText={errorText} />;
  }

  // Main render
  return (
    <View className="flex-1 bg-white">
      <TouchableOpacity className="flex-row items-center bg-white px-4 py-2"
        onPress={() => {
          navigate("GeneralProfile", { username: username });
        }}>
        {pictureUrl !== "" && (<Image
          source={{ uri: pictureUrl || "defaultProfilePicUrl" }}
          className="w-11 h-11 rounded-full"
        />)}
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
        >
          {messages.map((message) => (
            <View
              key={`${message.creationDate}`}
              className={`mb-4 ${message.username === user ? 'items-end self-end' : 'items-start self-start'} max-w-[60%]`}
            >
              <View
                className={`rounded-lg px-3 py-2 ${message.username === user ? 'bg-secondary' : 'bg-lightgray'} `}
              >
                <Text className='text-sm mb-0.5'>{message.content.trim()}</Text>
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
              onChangeText={handleMessageChange}
              multiline
            />
            <TouchableOpacity style={{
              backgroundColor:
                !disableSendButton && messageText !== ""
                  ? COLORS.primary
                  : COLORS.lightgray,
            }} className="py-2 px-3 rounded-full" onPress={sendMessage} disabled={disableSendButton || messageText === ""}>
              <Text className="text-white">Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatDetailScreen;
