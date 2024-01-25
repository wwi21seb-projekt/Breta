import { View, Text, TouchableOpacity } from "react-native";
import FloatingTextInput from "../components/FloatingTextInput";
import axios from "axios";
import { baseUrl } from "../env";
import styles from "../stylesheets/styleFloatingInput";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
// import { SIZES, COLORS } from "../constants/theme";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [isEmailFilled, setIsEmailFilled] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = () => {
    axios
      .post(`${baseUrl}users/login`, {
        email: email,
        password: password,
      })
      .then(function (response) {
        if (response.status == 200) {
          navigation.navigate("Feed" as never);
        }
      })
      .catch(function (error) {
        switch (error.response.status) {
          case 401: {
            console.log("Bitte bestätige erst deinen Code");
            //weiterleiten auf code eingeben page
            break;
          }
          case 403: {
            setError("Die Email-Adresse oder das Passwort ist falsch");
            // hier eventuell Email und Passwort Input leeren
            break;
          }
          case 404: {
            setError("Die Email-Adresse oder das Passwort ist falsch");
            // hier eventuell Email und Passwort Input leeren
            break;
          }
        }
      });
  };

  return (
    <View>
      <FloatingTextInput
        label="Email Adresse"
        value={email}
        onChangeText={(text: any) => {
          setEmail(text);
          setIsEmailFilled(!!text);
          setErrorEmail("");
        }}
        onBlur={() => {
          if (!emailRegex.test(email)) {
            setErrorEmail("Die Email-Adresse hat keine korrekte Form!");
          }
        }}
      />
      {errorEmail && <Text style={styles.error}>{errorEmail}</Text>}
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
              isEmailFilled && emailRegex.test(email) && password.length >= 8
                ? "#00CED1"
                : "#d3d3d3",
          },
        ]}
        onPress={handleLogin}
        disabled={
          !isEmailFilled || !emailRegex.test(email) || password.length < 8
        }
      >
        <Text style={{ color: "#000000", fontSize: 20 }}>Einloggen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
