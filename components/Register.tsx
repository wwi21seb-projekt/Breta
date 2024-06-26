import React, { useState, Dispatch, SetStateAction } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import FloatingLabelInput from "./FloatingLabelInput";
import { COLORS } from "../theme";
import { useAuth } from "../authentification/AuthContext";

interface Props {
  setServerError: Dispatch<SetStateAction<string>>;
}

const Register: React.FC<Props> = ({ setServerError }) => {
  const { register } = useAuth();
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
        /[`!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?~ ]/.test(password)
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

  return (
    <ScrollView
      className="bg-white px-10"
      automaticallyAdjustKeyboardInsets={true}
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
        onPress={() =>
          register(
            username,
            password,
            nickname,
            email,
            setServerError,
            setUsernameErrorText,
            setEmailErrorText,
          )
        }
      >
        <Text className="text-base">Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Register;
