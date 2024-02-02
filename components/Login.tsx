import { ScrollView, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FloatingTextInput from "../components/FloatingTextInput";
import { baseUrl } from "../env";
import styles from "../stylesheets/styleFloatingInput";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { COLORS } from "../theme";

const Login = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorUsername, setErrorUsername] = useState("");
  const [isUsernameFilled, setIsUsernameFilled] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async () => {
    let response;
    let data;
    try {
      response = await fetch(`${baseUrl}users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      data = await response.json();
      switch (response.status) {
        case 200:
          setError("");
          try {
            await AsyncStorage.setItem("token", data.token);
            await AsyncStorage.setItem("refreshToken", data.refreshToken);
          } catch (error) {
            console.log("Error: ", error);
          }
          navigation.navigate("Feed" as never);
          break;

        case 401:
          setError("Bitte bestätige erst deinen Code");
          //weiterleiten auf code eingeben page
          break;
        case 403:
          setError("Die Email-Adresse oder das Passwort ist falsch");
          // hier eventuell Email und Passwort Input leeren
          break;
        case 404:
          setError("Die Email-Adresse oder das Passwort ist falsch");
          // hier eventuell Email und Passwort Input leeren
          break;
        default:
          console.error(response.status);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <ScrollView
        className="bg-white"
        automaticallyAdjustKeyboardInsets={true}
        showsVerticalScrollIndicator={false}
      >
      <FloatingTextInput
        label="Username"
        value={username}
        onChangeText={(text: any) => {
          setUsername(text);
          setIsUsernameFilled(!!text);
          setErrorUsername("");
        }}
      />
      {errorUsername && <Text style={styles.error}>{errorUsername}</Text>}
      <FloatingTextInput
        textContentType="oneTimeCode"
        secureTextEntry={true}
        label="Passwort"
        value={password}
        onChangeText={(text: any) => {
          setPassword(text);
        }}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity
        style={
          {
            backgroundColor:
              isUsernameFilled && password.length >= 8 ? COLORS.primary : COLORS.lightgray,
          }
        }
        className="p-4 mx-20 mt-10 items-center rounded-2xl"
        onPress={handleLogin}
        disabled={!isUsernameFilled || password.length < 8}
      >
        <Text className="text-lg">Einloggen</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Login;
