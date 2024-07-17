import { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { COLORS } from "../theme";
import { baseUrl } from "../env";
import Error from "../components/ErrorComp";
import { useAuth } from "../authentification/AuthContext";
import { navigate } from "../navigation/NavigationService";
import ConfirmationCodeField from "../components/ConfirmationCodeField";

const ConfirmCodeScreen = () => {
  const { user, activateUser } = useAuth();
  const [value, setValue] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [alreadyActivated, setAlreadyActivated] = useState(false);
  const [confirmErrorText, setConfirmErrorText] = useState("");
  const [serverError, setServerError] = useState("");
  const [hasResent, setHasResent] = useState(false);

  // Function to send a new confirmation code
  const sendNewCode = async () => {
    let response;
    let data;
    try {
      response = await fetch(`${baseUrl}users/${user}/activate`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      switch (response.status) {
        case 204:
          setHasResent(true);
          break;
        case 208:
          setAlreadyActivated(true);
          break;
        case 404:
          data = await response.json();
          setConfirmErrorText(data.error.message);
          break;
        default:
          setServerError("Something went wrong, please try again later.");
      }
    } catch (error) {
      setServerError(
        "There are issues communicating with the server, please try again later.",
      );
    }
  };

  // Render error component if there's an error
  if (serverError) {
    return <Error errorText={serverError} />;
  } 
  // Render success message if the account is confirmed
  else if (isConfirmed) {
    return (
      <View className="bg-white px-6 h-full pt-4">
        <Text className="text-base">
          Your account has been activated successfully.
        </Text>
        <View className="flex-row bg-white">
          <Text className="text-base">You can now</Text>
          <TouchableOpacity onPress={() => navigate("Authentification")}>
            <Text className="text-primary text-base underline font-semibold">
              {" "}
              login.{" "}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } 
  // Render message if the account is already activated
  else if (alreadyActivated) {
    return (
      <View className="bg-white px-6 h-full pt-4">
        <Text className="text-base">
          Your account has been already activated.
        </Text>
        <View className="flex-row bg-white">
          <Text className="text-base">Please</Text>
          <TouchableOpacity onPress={() => navigate("Authentification")}>
            <Text className="text-primary text-base underline font-semibold">
              {" "}
              login.{" "}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } 
  // Main render
  else {
    return (
      <View className="bg-white px-8 h-full pt-4">
        {hasResent ? (
          <Text className="text-center text-base mb-6 text-green">
            A new code has been sent to your email.
          </Text>
        ) : (
          <Text className="text-center text-base mb-6">
            A code has been sent to your email.
          </Text>
        )}
        <Text className="text-center text-lg font-bold mb-2">
          Please confirm the code here:
        </Text>
        <ConfirmationCodeField value={value} setValue={setValue}/>
        {!!confirmErrorText && (
          <Text className="text-red text-sm pt-3 px-8 text-center">
            {confirmErrorText}
          </Text>
        )}
        <TouchableOpacity
          className="mx-16 p-2 items-center rounded-md mt-12"
          style={{
            backgroundColor: value.length < 6 ? COLORS.lightgray : COLORS.primary,
          }}
          onPress={() =>
            activateUser(
              value,
              setIsConfirmed,
              setAlreadyActivated,
              setConfirmErrorText,
              setServerError,
            )
          }
          disabled={value.length < 6}
        >
          <Text className="text-black text-lg text-center">Confirm</Text>
        </TouchableOpacity>

        <View className="border-b-black border-b-2 mt-6 mb-2" />
        <Text className="text-sm">Didn't receive a code?</Text>
        <View className="flex-row">
          <Text className="text-sm">Click</Text>
          <TouchableOpacity onPress={() => sendNewCode()}>
            <Text className="text-primary text-sm underline font-semibold">
              {" "}
              here{" "}
            </Text>
          </TouchableOpacity>
          <Text className="text-sm">to get a new one.</Text>
        </View>
      </View>
    );
  }
};

export default ConfirmCodeScreen;
