import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function Search() {
  return (
    <View className="flex h-screen justify-center items-center">
      <Text className="text-xl">Suche</Text>
      <StatusBar style="auto" />
    </View>
  );
}


