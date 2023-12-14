import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function Feed() {
  return (
    <View style={styles.container}>
      <Text>"Einmal ein Lumbegfgdr Jack bitte" ~Kemal, 08-10.2023</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  addIcon: {
    backgroundColor: "black",
    width: 100, // Durchmesser des Kreises
    height: 100, // Durchmesser des Kreises
    borderRadius: 50, // Radius des Kreises (Hälfte des Durchmessers)
  },
});
