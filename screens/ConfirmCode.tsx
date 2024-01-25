import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { SIZES, SHADOWS, COLORS } from "../theme";
import axios from "axios";
import { useNavigation } from "react-router-dom";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    alignContent: "center",
    justifyContent: "center",
  },
  mediumTitle: { textAlign: "center", fontSize: 25 },
  normal: { textAlign: "center", fontSize: 18 },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: "#00000030",
    textAlign: "center",
  },
  focusCell: {
    borderColor: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

const CELL_COUNT = 6;

const ConfirmCode = () => {
  const navigation = useNavigation();

  const baseUrl = "http://localhost:3000/api/v1/";

  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [serverError, setServerError] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const confirm = () => {
    console.log(value);

    if (value !== "") {
      axios
        .post(baseUrl + "users/" + "Marcelo" + "/activate", {
          //Variable bekommen
          token: value,
        })
        .then(function (response) {
          if (response.status == 200) {
            setServerError("");
            navigation.navigate("Register");
          }
        })
        .catch(function (error) {
          switch (error.response.status) {
            case 400: {
              setServerError("Der User wurde nicht gefunden");
              break;
            }

            case 409: {
              console.log("401");
              setServerError("Du bist nicht authorisiert das zu machen");
              break;
            }
          }
        });
    } else {
      return;
    }
  };

  const newCode = () => {
    axios
      .post(baseUrl + "users/" + "Marcelo" + "/activate", {
        //Variable bekommen
      })
      .then(function (response) {
        if (response.status == 200) {
          setServerError("");
          setConfirmationMessage(
            "Ihnen wurde ein neuer Code zugesendet. Schauen Sie in ihrem E-Mail-Postfach nach.",
          );
          navigation.navigate("CodePage");
        }
      })
      .catch(function (error) {
        switch (error.response.status) {
          case 400: {
            setServerError("Der User wurde nicht gefunden.");
            setConfirmationMessage("");
            break;
          }

          case 409: {
            console.log("401");
            setServerError("Du bist nicht authorisiert das zu machen.");
            setConfirmationMessage("");
            break;
          }
        }
      });
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.normal}>
          Es wurde ein Code an ihre Mail gesendet
        </Text>
        <Text style={styles.mediumTitle}>Bitte hier den Code Bestätigen:</Text>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />

        <View>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: value.length < 6 ? COLORS.white : COLORS.primary,
              margin: 10,
              padding: 12,
              alignItems: "center",
              borderRadius: 18,
              ...SHADOWS.medium,
            }}
            onPress={() => confirm()}
            disabled={value.length < 6}
          >
            <Text
              style={{
                color: COLORS.black,
                fontSize: SIZES.large,
                alignItems: "center",
              }}
            >
              Bestätigen
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
            paddingTop: 15,
          }}
        ></View>
        <View style={{ paddingTop: 10 }}>
          <Text style={{ textAlign: "center" }}>
            Haben Sie keinen Code erhalten?
            <TouchableOpacity onPress={() => newCode()}>
              <Text style={{ fontWeight: "bold" }}>
                {" "}
                Erhalten Sie einen neuen Code
              </Text>
            </TouchableOpacity>
          </Text>
        </View>
        {!!serverError && (
          <Text
            style={{ color: COLORS.red, paddingTop: 20, textAlign: "center" }}
          >
            {serverError}
          </Text>
        )}
        {!!confirmationMessage && (
          <Text
            style={{ color: COLORS.green, paddingTop: 20, textAlign: "center" }}
          >
            {confirmationMessage}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ConfirmCode;
