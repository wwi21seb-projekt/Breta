import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { COLORS } from "../theme";
import Register from "../components/Register";
import Login from "../components/Login";
import Error from "../components/ErrorComp";
import { useFocusEffect } from "@react-navigation/native";


const AuthScreen = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleButtonPress = () => {
    setShowRegistration(!showRegistration);
  };

  useFocusEffect(
    React.useCallback(() => {
      setShowRegistration(false);
    }, []),
  );

  if (serverError !== "") {
    return <Error errorText={serverError} />;
  } else {
  return (
    <SafeAreaView className="flex-1 bg-white ">
      <View className="flex-row my-6 mx-10 rounded-xl">
        <TouchableOpacity
          style={{
            backgroundColor: showRegistration ? COLORS.white : COLORS.primary,
          }}
          className="flex-1 items-center px-3 py-1 rounded-l-xl border border-primary"
          onPress={() => showRegistration && handleButtonPress()}
        >
          <Text className="text-black text-lg">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: showRegistration ? COLORS.primary : COLORS.white,
          }}
          onPress={() => !showRegistration && handleButtonPress()}
          className="flex-1 items-center px-3 py-1 rounded-r-xl border border-primary"
        >
          <Text className="text-black text-lg">Register</Text>
        </TouchableOpacity>
      </View>

      {showRegistration ? <Register setServerError={setServerError}/> : <Login setServerError={setServerError}/>}
    </SafeAreaView>
  );
  }
};

export default AuthScreen;
