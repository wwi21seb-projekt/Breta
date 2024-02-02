import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import FloatingTextInput from "../components/FloatingTextInput";
import { SIZES, SHADOWS, COLORS } from "../theme";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { baseUrl } from "../env";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const register = async () => {
    if (checkInputFields()) {
      let response; 
      try {
        await AsyncStorage.setItem("user", username);
        response = await fetch(`${baseUrl}users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({username, password, nickname, email}),
        });
        switch (response.status) {
          case 201:
            setServerError("");
            navigation.navigate("ConfirmCode");
            break;
          case 400:
            setServerError("Irgendwas ist schief gelaufen");
            break;
          case 409:
            setServerError("Der User existiert schon");
            break;
          case 422: {
            setServerError("Bitte geben Sie eine valide E-Mail ein");
            break;
          }
          default:
            console.error(response.status);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    } else {
      return;
    }
  };

  return (
    <ScrollView
      className="bg-white"
      automaticallyAdjustKeyboardInsets={true}
      showsVerticalScrollIndicator={false}
    >
      <FloatingTextInput
        label="Email Adresse"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      {!!emailError && (
        <Text
          style={{ color: "#FF2D55", paddingBottom: 20, textAlign: "center" }}
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
        textContentType="oneTimeCode"
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
        textContentType="oneTimeCode"
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
          backgroundColor: !checkForInput() ? COLORS.primary : COLORS.lightgray,
          ...SHADOWS.medium,
        }}
        className="p-4 mx-20 my-10 items-center rounded-2xl"
        disabled={checkForInput()}
        onPress={() => register()}
      >
        <Text className="text-lg">Registrieren</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Register;
