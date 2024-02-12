import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { checkAuthentification } from "../authentification/CheckAuthentification";
import LoginPopup from "../components/LoginPopup";

export default function Chat() {
  const isAuthenticated = checkAuthentification();

  if (!isAuthenticated) {
    return <LoginPopup/>;
  }

  return (
    <View style={styles.container}>
      <Text>Chat</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
