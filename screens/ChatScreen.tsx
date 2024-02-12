import { Text, View } from "react-native";
import { checkAuthentification } from "../authentification/CheckAuthentification";
import LoginPopup from "../components/LoginPopup";

const ChatScren = () => {
  const isAuthenticated = checkAuthentification();

  if (!isAuthenticated) {
    return <LoginPopup />;
  } else {
    return (
      <View className="bg-white items-center justify-center flex-1">
        <Text>Chat</Text>
      </View>
    );
  }
};

export default ChatScren;