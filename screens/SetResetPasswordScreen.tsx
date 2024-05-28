import { Text, View, TouchableOpacity } from "react-native";
import { COLORS} from "../theme";
import { useState } from "react";
import FloatingLabelInput from "../components/FloatingLabelInput";
import { checkNewPassword } from "../components/functions/CheckNewPassword";
import { checkConfirmNewPassword } from "../components/functions/CheckConfirmNewPassword";
import { handleNewPasswordChange } from "../components/functions/HandleNewPasswordChange";
import { handleConfirmNewPasswordChange } from "../components/functions/HandleConfirmNewPasswordChange";
import { updateFormValidity } from "../components/functions/FormValidity";
import { baseUrl } from "../env";
import ErrorComp from "../components/ErrorComp";
import { navigate } from "../navigation/NavigationService";
import { ScrollView } from "react-native-gesture-handler";
import ConfirmationCodeField from "../components/ConfirmationCodeField";

const SetResetPasswordScreen = () => {
    const [value, setValue] = useState("");
  const [newResetPassword, setNewResetPassword] = useState("");
  const [confirmNewResetPassword, setConfirmNewResetPassword] = useState("");
  const [newResetPasswordErrorText, setNewResetPasswordErrorText] = useState("");
  const [confirmNewResetPasswordErrorText, setConfirmNewResetPasswordErrorText] =
    useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isReseted, setIsReseted] = useState(false);
  const [username, setUsername] = useState("");
  const [isUsernameFilled, setIsUsernameFilled] = useState(false);
  const [errorText, setErrorText] = useState("");

  const resetPassword = async () => {
    let response;
    let data;
    try {
      response = await fetch(`${baseUrl}users/${username}/reset-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: value,
          newPassword: newResetPassword,
        }),
      });
      switch (response.status) {
        case 204:
          setIsReseted(true);
          break;
        case 400:
        case 403:
        case 404:
          data = await response.json();
          setErrorText(data.error.message);
          break;
        default:
          setErrorText("Something went wrong, please try again later.");
      }
    } catch (error) {
      setErrorText(
        "There are issues communicating with the server, please try again later.",
      );
    }
  };

  if (errorText !== "") {
    return <ErrorComp errorText={errorText} />;
  }
  else if (isReseted) {
    return (
      <View className="bg-white px-6 h-full pt-4">
        <Text className="text-base">
          Your password has been reseted successfully.
        </Text>
        <View className="flex-row bg-white">
          <Text className="text-base">You can now</Text>
          <TouchableOpacity onPress={() => navigate("Authentification")}>
            <Text className="text-primary text-base underline font-semibold">
              {" "}login{" "}
            </Text>
          </TouchableOpacity>
          <Text className="text-base">with your new password.</Text>
        </View>
      </View>
    );
  } else {
    return (
      <ScrollView className="bg-white px-10" automaticallyAdjustKeyboardInsets={true}
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={false}>
      <Text className="my-4 text-base">A confirmation code has been sent to the corresponding email address.</Text>
      <View className="mb-6">
    <ConfirmationCodeField value={value} setValue={setValue}/>
  </View>
  <FloatingLabelInput
        label="Username"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          setIsUsernameFilled(!!text);
        }}
      />
   <FloatingLabelInput
      textContentType="oneTimeCode"
      errorText={newResetPasswordErrorText}
      secureTextEntry={true}
      label="New password"
      value={newResetPassword}
      onChangeText={(text: string) => {
      handleNewPasswordChange(text, setNewResetPasswordErrorText, setNewResetPassword);
      }}
      onBlur={() => {
      checkNewPassword(newResetPassword, setNewResetPasswordErrorText);
      updateFormValidity(newResetPassword, setNewResetPasswordErrorText, confirmNewResetPassword, setConfirmNewResetPasswordErrorText, setIsFormValid);
      }}
    />
    <FloatingLabelInput
      textContentType="oneTimeCode"
      errorText={confirmNewResetPasswordErrorText}
      secureTextEntry={true}
      label="Confirm new password"
      value={confirmNewResetPassword}
      onChangeText={(text: string) => {
      handleConfirmNewPasswordChange(text, setConfirmNewResetPasswordErrorText, setConfirmNewResetPassword);
      }}
      onBlur={() => {
      checkConfirmNewPassword(confirmNewResetPassword, newResetPassword, setConfirmNewResetPasswordErrorText)
      updateFormValidity(newResetPassword, setNewResetPasswordErrorText, confirmNewResetPassword, setConfirmNewResetPasswordErrorText, setIsFormValid);
      }}
    />
    <TouchableOpacity
      className="items-center mt-6 mb-20 py-3 mx-16 rounded-xl"
      style={{
        backgroundColor: isFormValid && isUsernameFilled
          ? COLORS.primary
          : COLORS.lightgray,
        }}
        onPress={resetPassword}
        disabled={!isFormValid || !isUsernameFilled}
    ><Text className="text-base">Reset password</Text></TouchableOpacity>
  </ScrollView>
    );
  }
};

export default SetResetPasswordScreen;