import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SHADOWS } from "../theme";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { baseUrl } from "../env";
import { User } from "../components/types/User";
import ErrorComp from "../components/ErrorComp";
import { useAuth } from "../authentification/AuthContext";
import FloatingLabelInput from "../components/FloatingLabelInput";
import { Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme";

type RouteParams = {
  user: User;
};

const EditProfileScreen = () => {
  const route = useRoute();
  const params = route.params as RouteParams;
  const user = params.user;

  const { token } = useAuth();
  const [errorText, setErrorText] = useState("");
  const [isInfoChangeSuccessful, setIsInfoChangeSuccessful] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname);
  const [status, setStatus] = useState(user?.status);
  const [nicknameHeight, setNicknameHeight] = useState();
  const [statusHeight, setStatusHeight] = useState();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newPasswordErrorText, setNewPasswordErrorText] = useState("");
  const [oldPasswordErrorText, setOldPasswordErrorText] = useState("");
  const [confirmNewPasswordErrorText, setConfirmNewPasswordErrorText] =
    useState("");
  const [isPasswordFieldVisible, setIsPasswordFieldVisible] = useState(false);
  const [isPasswordChangeSuccessful, setIsPasswordChangeSuccessful] =
    useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const maxCharactersNickname = 25;
  const maxCharactersStatus = 256;

  const updateFormValidity = () => {
    const isValid = checkNewPassword() && checkConfirmNewPassword();
    setIsFormValid(isValid);
  };

  const handleTrivialInfoChange = async () => {
    let response;
    let data;
    try {
      response = await fetch(`${baseUrl}users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nickname: nickname,
          status: status,
        }),
      });
      data = await response.json();
      switch (response.status) {
        case 200:
          setIsInfoChangeSuccessful(true);
          setTimeout(() => {
            setIsInfoChangeSuccessful(false);
          }, 3000);
          break;
        case 400:
          setErrorText(data.error.message);
          break;
        case 401:
          setErrorText(data.error.message);
          break;
        default:
          setErrorText("Something went wrong. Please try again.");
      }
    } catch (error) {
      setErrorText("Connection error. Please try again.");
    }
  };

  const onNicknameContentSizeChange = (event: any) => {
    setNicknameHeight(event.nativeEvent.contentSize.height + 10);
  };

  const onStatusContentSizeChange = (event: any) => {
    setStatusHeight(event.nativeEvent.contentSize.height + 10);
  };

  const handleNicknameChange = (text: string) => {
    if (text.length <= maxCharactersNickname) {
      setNickname(text);
    }
  };

  const handleStatusChange = (text: string) => {
    if (text.length <= maxCharactersStatus) {
      setStatus(text);
    }
  };

  const checkNewPassword = () => {
    if (newPassword.length === 0) {
      setNewPasswordErrorText("");
      return false;
    } else if (newPassword.length >= 8) {
      if (
        /[A-Z]/.test(newPassword) &&
        /[a-z]/.test(newPassword) &&
        /\d/.test(newPassword) &&
        /[`!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?~ ]/.test(newPassword)
      ) {
        setNewPasswordErrorText("");
        return true;
      } else {
        setNewPasswordErrorText(
          "The password must contain at least one lowercase letter, one uppercase letter, one number and one special character.",
        );
        return false;
      }
    } else {
      setNewPasswordErrorText(
        "The password must be at least 8 characters long.",
      );
      return false;
    }
  };

  const handleNewPasswordChange = (text: string) => {
    setNewPasswordErrorText("");
    if (text.length <= 20) {
      setNewPassword(text);
    }
  };

  const checkConfirmNewPassword = () => {
    if (confirmNewPassword.length === 0) {
      setConfirmNewPasswordErrorText("");
      return false;
    } else if (newPassword === confirmNewPassword) {
      setConfirmNewPasswordErrorText("");
      return true;
    } else {
      setConfirmNewPasswordErrorText("The passwords do not match.");
      return false;
    }
  };

  const handleConfirmNewPasswordChange = (text: string) => {
    setConfirmNewPasswordErrorText("");
    if (text.length <= 20) {
      setConfirmNewPassword(text);
    }
  };

  const handlePasswordChange = async () => {
    let response;
    let data;
    try {
      response = await fetch(`${baseUrl}users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });
      switch (response.status) {
        case 204:
          setIsPasswordChangeSuccessful(true);
          setIsPasswordFieldVisible(false);
          setTimeout(() => {
            setIsPasswordChangeSuccessful(false);
          }, 3000);
          break;
        case 400:
        case 401:
          data = await response.json();
          setErrorText(data.error.message);
          break;
        case 403:
          data = await response.json();
          setOldPassword("");
          setOldPasswordErrorText(data.error.message);
          break;
        default:
          setErrorText("Something went wrong. Please try again.");
      }
    } catch (error) {
      setErrorText("Connection error. Please try again.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsInfoChangeSuccessful(false);
      setIsPasswordChangeSuccessful(false);
      setIsPasswordFieldVisible(false);
      setErrorText("");
    }, []),
  );

  if (errorText !== "") {
    return <ErrorComp errorText={errorText} />;
  } else if (user !== undefined) {
    return (
      <ScrollView
        className="bg-white"
        automaticallyAdjustKeyboardInsets={true}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center">
          <Image
            source={require("../assets/images/Max.jpeg")}
            // source={user?.profilePictureUrl} sobald die Bilder gehen
            className="w-3/5 h-36 rounded-full mt-8 mb-3"
            alt="Profilbild"
          />
        </View>
        <Text className="italic text-lg text-darkgray self-center mb-4">
          @{user?.username}
        </Text>
        <View
          className="text-center bg-white p-2 mx-16 mb-3 rounded-2xl"
          style={{ ...SHADOWS.small }}
        >
          <TextInput
            className="text-center text-xl"
            style={{ height: nicknameHeight }}
            value={nickname}
            onChangeText={handleNicknameChange}
            onBlur={handleTrivialInfoChange}
            placeholder="Nickname"
            multiline
            numberOfLines={1}
            onContentSizeChange={onNicknameContentSizeChange}
          />
          <Text className="self-center mt-1 text-xs">
            {nickname?.length} / {maxCharactersNickname}
          </Text>
        </View>

        <View
          className="text-center bg-white p-2 mx-16 mb-3 rounded-2xl"
          style={{ ...SHADOWS.small }}
        >
          <TextInput
            className="text-center text-base"
            style={{ height: statusHeight }}
            value={status}
            onChangeText={handleStatusChange}
            onBlur={handleTrivialInfoChange}
            placeholder="Status"
            multiline
            numberOfLines={1}
            onContentSizeChange={onStatusContentSizeChange}
          />
          <Text className="self-center mt-1 text-xs">
            {status?.length} / {maxCharactersStatus}
          </Text>
        </View>
        {isInfoChangeSuccessful && (
          <Text className="self-center mx-10 mt-1 text-xs text-green">
            Your nickname and status have been updated successfully!
          </Text>
        )}
        <View className="bg-white">
          <TouchableOpacity
            className="flex-row mt-6 ml-8 mb-3 items-center"
            onPress={() => {
              setIsPasswordFieldVisible(!isPasswordFieldVisible);
              setOldPassword("");
              setNewPassword("");
              setConfirmNewPassword("");
              setOldPasswordErrorText("");
              setNewPasswordErrorText("");
              setConfirmNewPasswordErrorText("");
            }}
          >
            {isPasswordFieldVisible && (
              <Icon
                as={Ionicons}
                name="chevron-down-outline"
                size="sm"
                color={COLORS.darkgray}
              />
            )}
            {!isPasswordFieldVisible && (
              <Icon
                as={Ionicons}
                name="chevron-forward-outline"
                size="sm"
                color={COLORS.darkgray}
              />
            )}

            <Text className="ml-1 text-darkgray text-base">
              Change your password
            </Text>
          </TouchableOpacity>
          {isPasswordChangeSuccessful && (
            <Text className="mt-1 mx-8 text-xs text-green">
              Your password has been updated successfully!
            </Text>
          )}
        </View>

        {isPasswordFieldVisible && (
          <View className="bg-white px-10">
            <FloatingLabelInput
              textContentType="oneTimeCode"
              errorText={oldPasswordErrorText}
              secureTextEntry={true}
              label="Old password"
              value={oldPassword}
              onChangeText={(text: any) => {
                setOldPasswordErrorText("");
                setOldPassword(text);
              }}
            />
            <FloatingLabelInput
              textContentType="oneTimeCode"
              errorText={newPasswordErrorText}
              secureTextEntry={true}
              label="New password"
              value={newPassword}
              onChangeText={handleNewPasswordChange}
              onBlur={() => {
                checkNewPassword();
                updateFormValidity();
              }}
            />
            <FloatingLabelInput
              textContentType="oneTimeCode"
              errorText={confirmNewPasswordErrorText}
              secureTextEntry={true}
              label="Confirm new password"
              value={confirmNewPassword}
              onChangeText={handleConfirmNewPasswordChange}
              onBlur={() => {
                checkConfirmNewPassword();
                updateFormValidity();
              }}
            />
            <TouchableOpacity
              className="items-center mt-6 mb-20 py-3 mx-16 rounded-xl"
              style={{
                backgroundColor: isFormValid
                  ? COLORS.primary
                  : COLORS.lightgray,
              }}
              onPress={handlePasswordChange}
              disabled={!isFormValid}
            >
              <Text className="text-base">Change password</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  } else {
    return <ErrorComp errorText="Something went wrong. Please try again." />;
  }
};

export default EditProfileScreen;
