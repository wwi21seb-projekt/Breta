import { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { SIZES, COLORS } from "../theme";
import styles from "../stylesheets/styleFloatingInput";
import Register from "../components/Register";
import Login from "../components/Login";

const AuthScreen = () => {
  const [showRegistration, setShowRegistration] = useState(true);

  const handleButtonPress = () => {
    setShowRegistration(!showRegistration)
  };

  return (
    <SafeAreaView className="flex-1 bg-white ">
      <View className="flex-row my-10">
        <TouchableOpacity
          style={[
            ...SHADOWS.small,
            {
              backgroundColor: showRegistration ? COLORS.primary : COLORS.white,
            },
          ]}
          onPress={() => !showRegistration && handleButtonPress()}
        className="flex-1 items-center p-3 rounded-xl ml-10">
          <Text className="text-black text-xl">
            Registrierung
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            {
              backgroundColor: showRegistration ? COLORS.white : COLORS.primary,
            },
          ]}
          className="flex-1 items-center p-3 rounded-xl mr-10"
          onPress={() => showRegistration && handleButtonPress()}
          >
          <Text className="text-black text-xl">
            Login
          </Text>
        </TouchableOpacity>
      </View>

      {showRegistration ? (
        <View>
          <Register></Register>
        </View>
      ) : (
        <View>
          <Login />
        </View>
      )}
    </SafeAreaView>
  );
};

export default AuthScreen
