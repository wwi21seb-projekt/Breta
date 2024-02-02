import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { SIZES, SHADOWS, COLORS } from "../theme";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { baseUrl } from "../env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const styles = StyleSheet.create({
  focusCell: {
    borderColor: "#000",
  },
});

const CELL_COUNT = 6;

const ConfirmCode = ({ navigation }) => {
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [serverError, setServerError] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const confirm = async () => {
    if (value !== "") {
      let response;
      try {
        const user = await AsyncStorage.getItem("user");
        response = await fetch(`${baseUrl}users/${user}/activate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: 
            JSON.stringify({value})
          
        });
        switch (response.status) {
          case 200:
            setServerError("");
            navigation.navigate("Feed");
            break;
          case 400:
            setServerError("Der User wurde nicht gefunden");
            break;
          case 409:
            setServerError("Du bist nicht authorisiert das zu machen");
            break;
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

  const newCode = async () => {
    let response;
    try {
      const user = await AsyncStorage.getItem("user");
      response = await fetch(`${baseUrl}users/${user}/activate`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      switch (response.status) {
        case 200:
          setServerError("");
          setConfirmationMessage(
            "Ihnen wurde ein neuer Code zugesendet. Schauen Sie in ihrem E-Mail-Postfach nach.",
          );
          navigation.navigate("ConfirmCode");
          break;
        case 400:
          setServerError("Der User wurde nicht gefunden.");
          setConfirmationMessage("");
          break;
        case 409:
          setServerError("Unauthorized. Please login again");
          setServerError("Du bist nicht authorisiert das zu machen.");
          setConfirmationMessage("");
          break;
        default:
          console.error(response.status);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <SafeAreaView /*className="flex-1 p-5 align-center justify-center"*/>
      <View className="bg-white align-center justify-center">
        <Text className="text-center text-md">
          Es wurde ein Code an ihre Mail gesendet
        </Text>
        <Text className="text-center text-lg">
          Bitte hier den Code Bestätigen:
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
            <Text
              key={index}
              className="w-10 h-10 leading-10 text-md border-0.5 border-black text-center bg-primary"
              style={[isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />

        <View>
          <TouchableOpacity
            className="m-2.5 p-3 items-center rounded-md"
            style={{
              backgroundColor: value.length < 6 ? COLORS.white : COLORS.primary,
              ...SHADOWS.medium,
            }}
            onPress={() => confirm()}
            disabled={value.length < 6}
          >
            <Text className="text-black text-lg text-center">Bestätigen</Text>
          </TouchableOpacity>
        </View>
        <View className="border-b-black border-b-4 pt-3"></View>
        <View className="pt-2">
          <Text className="text-center">
            Haben Sie keinen Code erhalten?
            <TouchableOpacity onPress={() => newCode()}>
              <Text className="font-bold"> Erhalten Sie einen neuen Code</Text>
            </TouchableOpacity>
          </Text>
        </View>
        {!!serverError && (
          <Text className="text-red pt-5 text-center">{serverError}</Text>
        )}
        {!!confirmationMessage && (
          <Text className="text-green pt-5 text-center">
            {confirmationMessage}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ConfirmCode;
