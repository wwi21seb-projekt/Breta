import { Text, View, TouchableOpacity } from "react-native";
import { COLORS} from "../theme";
import { useState } from "react";
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
  } from "react-native-confirmation-code-field";
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

const CELL_COUNT = 6;

const SetResetPasswordScreen = () => {
    const [value, setValue] = useState("");
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newPasswordErrorText, setNewPasswordErrorText] = useState("");
  const [confirmNewPasswordErrorText, setConfirmNewPasswordErrorText] =
    useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isReseted, setIsReseted] = useState(false);
  const [username, setUsername] = useState("");
  const [isUsernameFilled, setIsUsernameFilled] = useState(false);
  const [errorTextUsername, setErrorTextUsername] = useState("");
  const [errorCodeField, setErrorCodeField] = useState("");
  const [errorText, setErrorText] = useState("");

  const resetPassword = async () => {
    let response;
    let data;
    try {
      response = await fetch(`${baseUrl}users/${username}/set-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        }
      });
      switch (response.status) {
        case 204:
          setIsReseted(true);
          break;
        case 400:
          data = await response.json();
          setErrorText(data.error.message);
          break;
        case 403:
          data = await response.json();
          setErrorCodeField(data.error.message);
          break;
        case 404:
          data = await response.json();
          setErrorTextUsername(data.error.message);
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
              {" "}
              login with your new password.{" "}
            </Text>
          </TouchableOpacity>
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
    <CodeField
    ref={ref}
    {...props}
    value={value}
    onChangeText={setValue}
    cellCount={CELL_COUNT}
    keyboardType="number-pad"
    textContentType="oneTimeCode"
    renderCell={({ index, symbol, isFocused }) => (
      <View
        key={index}
        style={{
          borderColor: isFocused ? COLORS.primary : COLORS.lightgray,
        }}
        className="w-10 h-10 border-2 rounded justify-center"
        onLayout={getCellOnLayoutHandler(index)}
      >
        <Text className="text-base text-center">
          {symbol || (isFocused ? <Cursor /> : null)}
        </Text>
      </View>
    )}
  />
  </View>
  {errorCodeField && (
    <Text className="mt-1 mx-8 text-xs text-red">
      {errorCodeField}
    </Text>
  )}
  <FloatingLabelInput
        errorText={errorTextUsername}
        noErrorText={true}
        label="Username"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          setIsUsernameFilled(!!text);
        }}
      />
   <FloatingLabelInput
      textContentType="oneTimeCode"
      errorText={newPasswordErrorText}
      secureTextEntry={true}
      label="New password"
      value={newPassword}
      onChangeText={(text: string) => {
      handleNewPasswordChange(text, setNewPasswordErrorText, setNewPassword);
      }}
      onBlur={() => {
      checkNewPassword(newPassword, setNewPasswordErrorText);
      updateFormValidity(newPassword, setNewPasswordErrorText, confirmNewPassword, setConfirmNewPasswordErrorText, setIsFormValid);
      }}
    />
    <FloatingLabelInput
      textContentType="oneTimeCode"
      errorText={confirmNewPasswordErrorText}
      secureTextEntry={true}
      label="Confirm new password"
      value={confirmNewPassword}
      onChangeText={(text: string) => {
      handleConfirmNewPasswordChange(text, setConfirmNewPasswordErrorText, setConfirmNewPassword);
      }}
      onBlur={() => {
      checkConfirmNewPassword(confirmNewPassword, newPassword, setConfirmNewPasswordErrorText)
      updateFormValidity(newPassword, setNewPasswordErrorText, confirmNewPassword, setConfirmNewPasswordErrorText, setIsFormValid);
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