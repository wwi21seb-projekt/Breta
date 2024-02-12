import { Text, View } from "react-native";
import { checkAuthentification } from "../authentification/CheckAuthentification";
import LoginPopup from "../components/LoginPopup";

export default function Chat() {
  const isAuthenticated = checkAuthentification();

  if (!isAuthenticated) {
    return <LoginPopup />;
  }

  return (
    <View className="bg-white items-center justify-center">
      <Text>Chat</Text>
    </View>
  );
}
