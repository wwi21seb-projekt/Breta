import { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { COLORS } from "../theme";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { baseUrl } from "../env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import Error from "../components/ErrorComp";

type RootStackParamList = {
  Authentification: undefined;
};
type NavigationType = StackNavigationProp<
  RootStackParamList,
  "Authentification"
>;

const CELL_COUNT = 6;

const ConfirmCodeScreen = () => {
  const navigation = useNavigation<NavigationType>();
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [alreadyActivated, setAlreadyActivated] = useState(false);
  const [confirmErrorText, setConfirmErrorText] = useState("");
  const [serverError, setServerError] = useState("");
  const [hasResent, setHasResent] = useState(false);

  const confirm = async () => {
    let response;
    let data;
    try {
      const user = await AsyncStorage.getItem("user");
      response = await fetch(`${baseUrl}users/${user}/activate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: value }),
      });
      data = await response.json();
      switch (response.status) {
        case 200:
          setIsConfirmed(true);
          break;
        case 208:
          setAlreadyActivated(true);
          break;
        case 401:
          setConfirmErrorText(data.error.message);
          break;
        case 404:
          setConfirmErrorText(data.error.message);
          break;
        default:
          setServerError("Something went wrong. Please try again.");
      }
    } catch (error) {
      setServerError("Connection error. Please try again.");
    }
  };

  const newCode = async () => {
    let response;
    let data;
    try {
      const user = await AsyncStorage.getItem("user");
      response = await fetch(`${baseUrl}users/${user}/activate`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      data = await response.json();
      switch (response.status) {
        case 204:
          setHasResent(true);
          break;
        case 208:
          setAlreadyActivated(true);
          break;
        case 404:
          setConfirmErrorText(data.error.message);
          break;
        default:
          setServerError("Something went wrong. Please try again.");
      }
    } catch (error) {
      setServerError("Connection error. Please try again.");
    }
  };

  if (!!serverError) {
    return <Error errorText={serverError} />;
  } else if (isConfirmed) {
    return (
      <View className="bg-white px-6 h-full pt-4">
        <Text className="text-base">
          Your account has been activated successfully.
        </Text>
        <View className="flex-row bg-white">
          <Text className="text-base">You can now</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Authentification")}
          >
            <Text className="text-primary text-base underline font-semibold">
              {" "}
              login.{" "}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else if (alreadyActivated) {
    return (
      <View className="bg-white px-6 h-full pt-4">
        <Text className="text-base">
          Your account has been already activated.
        </Text>
        <View className="flex-row bg-white">
          <Text className="text-base">Please</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Authentification")}
          >
            <Text className="text-primary text-base underline font-semibold">
              {" "}
              login.{" "}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
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
        {!!confirmErrorText && (
          <Text className="text-red text-sm pt-3 px-8 text-center">
            {confirmErrorText}
          </Text>
        )}
        <TouchableOpacity
          className="mx-16 p-2 items-center rounded-md mt-12"
          style={{
            backgroundColor:
              value.length < 6 ? COLORS.lightgray : COLORS.primary,
          }}
          onPress={() => confirm()}
          disabled={value.length < 6}
        >
          <Text className="text-black text-lg text-center">Confirm</Text>
        </TouchableOpacity>

        <View className="border-b-black border-b-2 mt-6 mb-2" />
        <Text className="text-sm">Didn't receive a code?</Text>
        <View className="flex-row">
          <Text className="text-sm">Click</Text>
          <TouchableOpacity onPress={() => newCode()}>
            <Text className="text-primary text-sm underline font-semibold">
              {" "}
              here{" "}
            </Text>
          </TouchableOpacity>
          <Text className="text-sm">to get a new one.</Text>
        </View>
        {/* {!!serverError && (
          <Text className="text-red pt-5 text-center">{serverError}</Text>
        )}
        {!!confirmationMessage && (
          <Text className="text-green pt-5 text-center">
            {confirmationMessage}
          </Text>
        )} */}
      </View>
    );
  }
};

export default ConfirmCodeScreen;
