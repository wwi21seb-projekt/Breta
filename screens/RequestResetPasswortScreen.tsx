import { TouchableOpacity, Text, View } from "react-native";
import FloatingLabelInput from "../components/FloatingLabelInput";
import { COLORS } from "../theme";
import { useState } from "react";
import { baseUrl } from "../env";
import { navigate } from "../navigation/NavigationService";
import ErrorComp from "../components/ErrorComp";

// Component for requesting password reset
const RequestResetPasswordScreen = () => {
  // State variables for handling username input and errors
  const [username, setUsername] = useState("");
  const [isUsernameFilled, setIsUsernameFilled] = useState(false);
  const [errorTextUsername, setErrorTextUsername] = useState("");
  const [errorText, setErrorText] = useState("");

  // Function to request a password reset
  const requestResetPassword = async () => {
    let response;
    let data;
    try {
      // Make POST request to reset password endpoint
      response = await fetch(`${baseUrl}users/${username}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      switch (response.status) {
        case 200:
          // Navigate to SetReset screen on success
          navigate("SetReset");
          break;
        case 404:
          // Handle case when user is not found
          data = await response.json();
          setErrorTextUsername(data.error.message);
          break;
        default:
          // Handle other errors
          setErrorText("Something went wrong, please try again later.");
      }
    } catch (error) {
      // Handle network or server errors
      setErrorText(
        "There are issues communicating with the server, please try again later.",
      );
    }
  };

  // Render error component if there's an error
  if (errorText !== "") {
    return <ErrorComp errorText={errorText} />;
  }
  // Main render
  else {
    return (
      <View className="bg-white px-10 h-full">
        <View className="mt-5">
          <FloatingLabelInput
            errorText={errorTextUsername}
            label="Username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setIsUsernameFilled(!!text);
              setErrorTextUsername("");
            }}
          />
        </View>
        <TouchableOpacity
          className="p-3 mt-8 items-center rounded-xl mx-12"
          style={{
            backgroundColor: isUsernameFilled
              ? COLORS.primary
              : COLORS.lightgray,
          }}
          onPress={requestResetPassword}
          disabled={!isUsernameFilled}
        >
          <Text className="text-base">Request password reset</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default RequestResetPasswordScreen;
