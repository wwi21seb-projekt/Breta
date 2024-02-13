import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import FloatingLabelInput from "./FloatingLabelInput";
import { COLORS } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { baseUrl } from "../env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "native-base";
import { StackNavigationProp } from "@react-navigation/stack";
import { Dispatch, SetStateAction } from "react";

interface Props {
  setServerError: Dispatch<SetStateAction<string>>;
}

type RootStackParamList = {
  ConfirmCode: undefined;
};
type NavigationType = StackNavigationProp<RootStackParamList, "ConfirmCode">;

const Register: React.FC<Props> = ({ setServerError }) => {
  const navigation = useNavigation<NavigationType>();
  const [isFormValid, setIsFormValid] = useState(false);

  const [emailErrorText, setEmailErrorText] = useState("");
  const [usernameErrorText, setUsernameErrorText] = useState("");
  const [nicknameErrorText, setNicknameErrorText] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const [repeatPasswordErrorText, setRepeatPasswordErrorText] = useState("");

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const updateFormValidity = () => {
    const isValid =
      checkEmail() &&
      checkUsername() &&
      checkPassword() &&
      checkRepeatPassword();
    setIsFormValid(isValid);
  };

  const checkEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length === 0) {
      setEmailErrorText("");
      return false;
    } else if (emailRegex.test(email)) {
      setEmailErrorText("");
      return true;
    } else {
      setEmailErrorText("The email address is invalid.");
      return false;
    }
  };

  const handleEmailChange = (text: string) => {
    setEmailErrorText("");
    if (text.length <= 128) {
      setEmail(text);
    }
  };

  const checkUsername = () => {
    if (username.length === 0) {
      setEmailErrorText("");
      return false;
    } else if (/^[a-zA-Z0-9]+$/.test(username)) {
      setUsernameErrorText("");
      return true;
    } else {
      setUsernameErrorText(
        "The username cannot contain any special characters or emojis.",
      );
      return false;
    }
  };

  const handleUsernameChange = (text: string) => {
    setUsernameErrorText("");
    if (text.length <= 20) {
      setUsername(text);
    }
  };

  const handleNicknameChange = (text: string) => {
    setNicknameErrorText("");
    if (text.length <= 25) {
      setNickname(text);
    }
  };

  const checkPassword = () => {
    if (password.length === 0) {
      setPasswordErrorText("");
      return false;
    } else if (password.length >= 8) {
      if (
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password) &&
        /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(password)
      ) {
        setPasswordErrorText("");
        return true;
      } else {
        setPasswordErrorText(
          "The password must contain at least one lowercase letter, one uppercase letter, one number and one special character.",
        );
        return false;
      }
    } else {
      setPasswordErrorText("The password must be at least 8 characters long.");
      return false;
    }
  };

  const handlePasswordChange = (text: string) => {
    setPasswordErrorText("");
    if (text.length <= 20) {
      setPassword(text);
    }
  };

  const checkRepeatPassword = () => {
    if (repeatPassword.length === 0) {
      setRepeatPasswordErrorText("");
      return false;
    } else if (password === repeatPassword) {
      setRepeatPasswordErrorText("");
      return true;
    } else {
      setRepeatPasswordErrorText("The passwords do not match.");
      return false;
    }
  };

  const handleRepeatPasswordChange = (text: string) => {
    setRepeatPasswordErrorText("");
    if (text.length <= 20) {
      setRepeatPassword(text);
    }
  };

  const register = async () => {
    let response;
    let data;
    try {
      // await AsyncStorage.setItem("user", username);
      response = await fetch(`${baseUrl}users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, nickname, email }),
      });
      data = await response.json();
      switch (response.status) {
        case 201:
          navigation.navigate("ConfirmCode");
          break;
        case 400:
          setServerError(data.error.message);
          break;
        case 409:
          if (data.error.code === "ERR-002") {
            setUsernameErrorText(data.error.message);
          } else if (data.error.code === "ERR-003") {
            setEmailErrorText(data.error.message);
          } else {
            setServerError("Something went wrong. Please try again.");
          }
          break;
        case 422: {
          setEmailErrorText(data.error.message);
          break;
        }
        default:
          setServerError("Something went wrong. Please try again.");
      }
    } catch (error) {
      setServerError("Connection error. Please try again.");
    }
  };

  return (
    <ScrollView
      className="bg-white px-10"
      // automaticallyAdjustKeyboardInsets={true}
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={false}
    >
      <FloatingLabelInput
        label="Email address"
        errorText={emailErrorText}
        value={email}
        onChangeText={handleEmailChange}
        onBlur={() => {
          checkEmail();
          updateFormValidity();
        }}
      />
      <FloatingLabelInput
        label="Username"
        errorText={usernameErrorText}
        value={username}
        onChangeText={handleUsernameChange}
        onBlur={() => {
          checkUsername();
          updateFormValidity();
        }}
      />
      <FloatingLabelInput
        label="Nickname (optional)"
        errorText={nicknameErrorText}
        value={nickname}
        onChangeText={handleNicknameChange}
      />
      <View className="mb-14" />
      <FloatingLabelInput
        textContentType="oneTimeCode"
        errorText={passwordErrorText}
        secureTextEntry={true}
        label="Password"
        value={password}
        onChangeText={handlePasswordChange}
        onBlur={() => {
          checkPassword();
          updateFormValidity();
        }}
      />
      <FloatingLabelInput
        textContentType="oneTimeCode"
        errorText={repeatPasswordErrorText}
        secureTextEntry={true}
        label="Repeat password"
        value={repeatPassword}
        onChangeText={handleRepeatPasswordChange}
        onBlur={() => {
          checkRepeatPassword();
          updateFormValidity();
        }}
      />
      <TouchableOpacity
        style={{
          backgroundColor: isFormValid ? COLORS.primary : COLORS.lightgray,
        }}
        className="p-3 mt-12 items-center rounded-xl mx-24"
        disabled={!isFormValid}
        onPress={() => register()}
      >
        <Text className="text-base">Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Register;
