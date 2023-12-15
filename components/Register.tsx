import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FloatingTextInput from "../components/FloatingTextInput";
import { SIZES, SHADOWS, COLORS } from "../constants/theme";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const Register = () => {
  const navigation = useNavigation();
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const baseUrl = "http://localhost:3000/api/v1/";

  const checkUsername = () => {
    if (/^[a-zA-Z0-9]+$/.test(username)) {
      // Überprüfung auf maximale Länge (20 Zeichen)
      if (username.length <= 20) {
        // Der Wert entspricht den Anforderungen
        setUsernameError("");
        return true;
      } else {
        // Der Wert ist zu lang
        setUsernameError(
          "Der Nutzername darf nicht länger als 20 Zeichen sein.",
        );
        return false;
      }
    } else {
      // Der Wert enthält Sonderzeichen oder Emojis
      setUsernameError(
        "Der Nutzername darf keine Sonderzeichen oder Emojis enthalten.",
      );
      return false;
    }
  };

  const checkEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Überprüfung auf maximale Länge (128 Zeichen)
    if (email.length <= 128) {
      // Überprüfung der E-Mail-Adresse mit dem Regex
      if (emailRegex.test(email)) {
        // Der Wert entspricht den Anforderungen
        setEmailError("");
        return true;
      } else {
        // Der Wert entspricht nicht dem E-Mail-Format
        setEmailError("Bitte gib eine gültige E-Mail-Adresse ein.");
        return false;
      }
    } else {
      // Der Wert ist zu lang
      setEmailError(
        "Die E-Mail-Adresse darf nicht länger als 128 Zeichen sein.",
      );
      return false;
    }
  };

  const checkNickname = () => {
    if (nickname.length <= 25) {
      return true;
    } else {
      setNicknameError("Der Nickname darf nicht länger als 25 Zeichen sein.");
      return false;
    }
  };

  const checkPassword = () => {
    if (password.length >= 8) {
      if (
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password)
      ) {
        setPasswordError(""); // Zurücksetzen des Fehlers
        return true;
      } else {
        setPasswordError(
          "Das Passwort muss mindestens einen Kleinbuchtsaben, einen Großbuchstaben und eine Zahl enthalten.",
        );
        return false;
      }
    } else {
      setPasswordError("Das Passwort muss mindestens 8 Zeichen lang sein.");
      return false;
    }
  };

  const checkRepeatPassword = () => {
    if (password === repeatPassword) {
      setRepeatPasswordError("");
      return true;
    } else {
      setRepeatPasswordError("Die Passwörter stimmen nicht überein");
      console.log("Ich bin doch hier");
      return false;
    }
  };

  const clearInputFields = () => {
    setEmail("");
    setUsername("");
    setNickname("");
    setPassword("");
    setRepeatPassword("");
  };

  const checkForInput = () => {
    if (
      username.length == 0 ||
      email.length == 0 ||
      password.length == 0 ||
      repeatPassword.length == 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  const checkInputFields = () => {
    let alltrue = true;
    let methods = [
      checkEmail(),
      checkUsername(),
      checkNickname(),
      checkPassword(),
      checkRepeatPassword(),
    ];

    for (const method of methods) {
      const ergebnis = method;
      alltrue = alltrue && ergebnis;
    }

    if (alltrue) {
      return true;
    } else {
      return false;
    }
  };

  const register = () => {
    if (checkInputFields()) {
      axios
        .post(baseUrl + "users", {
          username: username,
          nickname: nickname,
          email: email,
        })
        .then(function (response) {
          console.log(response);
          if (response.status == 201) {
            setServerError("");
            navigation.navigate("CodePage" as never);
          }
        })
        .catch(function (error) {
          switch (error.response.status) {
            case 400: {
              console.log("400");
              setServerError("Irgendwas ist schief gelaufen");
              break;
            }

            case 409: {
              console.log("409");
              setServerError("Der User existiert schon");
              break;
            }

            case 422: {
              console.log("422");
              setServerError("Bitte geben Sie eine valide E-Mail ein");
              break;
            }
          }
        });

      // auslagern?
    } else {
      return;
    }
  };

  return (
    <View>
      <FloatingTextInput
        label="Email Adresse"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      {!!emailError && (
        <Text
          style={{ color: COLORS.red, paddingBottom: 20, textAlign: "center" }}
        >
          {emailError}
        </Text>
      )}
      <FloatingTextInput
        label="Nutzername"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      {!!usernameError && (
        <Text
          style={{ color: COLORS.red, paddingBottom: 20, textAlign: "center" }}
        >
          {usernameError}
        </Text>
      )}
      <FloatingTextInput
        label="Nickname(optional)"
        value={nickname}
        onChangeText={(text) => setNickname(text)}
      />
      {!!nicknameError && (
        <Text
          style={{ color: COLORS.red, paddingBottom: 20, textAlign: "center" }}
        >
          {nicknameError}
        </Text>
      )}
      <TouchableOpacity
        style={{
          padding: 40,
        }}
      ></TouchableOpacity>
      <FloatingTextInput
        secureTextEntry={true}
        label="Passwort"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      {!!passwordError && (
        <Text
          style={{ color: COLORS.red, paddingBottom: 20, textAlign: "center" }}
        >
          {passwordError}
        </Text>
      )}
      <FloatingTextInput
        secureTextEntry={true}
        label="Passwort bestätigen"
        value={repeatPassword}
        onChangeText={(text) => setRepeatPassword(text)}
      />
      {!!repeatPasswordError && (
        <Text
          style={{ color: COLORS.red, paddingBottom: 20, textAlign: "center" }}
        >
          {repeatPasswordError}
        </Text>
      )}
      {!!serverError && (
        <Text
          style={{ color: COLORS.red, paddingBottom: 20, textAlign: "center" }}
        >
          {serverError}
        </Text>
      )}
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: !checkForInput() ? COLORS.primary : COLORS.lightgray,
          margin: 160,
          padding: 12,
          alignItems: "center",
          borderRadius: 18,
          ...SHADOWS.medium,
        }}
        disabled={checkForInput()}
        onPress={() => register()}
      >
        <Text style={{ color: COLORS.black, fontSize: SIZES.large }}>
          Registrieren
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;
