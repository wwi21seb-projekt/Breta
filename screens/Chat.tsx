import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"
import AuthScreen from "./AuthScreen"
import { useEffect, useState } from "react";

export default function Chat() {

  const [token, setToken] = useState("");

  useEffect(() => {
    async function getData(){
      let t = await AsyncStorage.getItem("token");
      setToken(t);
    }
    getData()
  })

  if(token === null){

    return(
      <AuthScreen></AuthScreen>
    )
  }
  else{
  return (
    <View style={styles.container}>
      <Text>Chat</Text>
      <StatusBar style="auto" />
    </View>
  );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
