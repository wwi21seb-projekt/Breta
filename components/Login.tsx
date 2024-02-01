import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FloatingTextInput from "../components/FloatingTextInput";
import { baseUrl } from "../env";
import styles from "../stylesheets/styleFloatingInput";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
// import { SIZES, COLORS } from "../constants/theme";

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
    <View>
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
        secureTextEntry={true}
        label="Passwort"
        value={password}
        onChangeText={(text: any) => {
          setPassword(text);
        }}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity
        style={[
          styles.loginButton,
          {
            backgroundColor:
              isUsernameFilled && password.length >= 8 ? "#00CED1" : "#d3d3d3",
          },
        ]}
        onPress={handleLogin}
        disabled={!isUsernameFilled || password.length < 8}
      >
        <Text style={{ color: "#000000", fontSize: 20 }}>Einloggen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
