import { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { COLORS, SHADOWS } from "../theme";
import Register from "../components/Register";
import Login from "../components/Login";

const AuthScreen = () => {
  const [showRegistration, setShowRegistration] = useState(false);

  const handleButtonPress = () => {
    setShowRegistration(!showRegistration);
  };

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

      {showRegistration ? <Register /> : <Login />}
    </SafeAreaView>
  );
};

export default AuthScreen;
