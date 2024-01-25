import { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { SIZES, COLORS } from "../theme";
import styles from "../stylesheets/styleFloatingInput";
import Register from "../components/Register";
import Login from "../components/Login";

const AuthScreen = () => {
  const [showRegistration, setShowRegistration] = useState(true);

  const handleButtonPress = () => {
    setShowRegistration(!showRegistration);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flexDirection: "row", marginVertical: 40 }}>
        <TouchableOpacity
          style={[
            styles.buttonSwitch,
            {
              backgroundColor: showRegistration ? COLORS.primary : COLORS.white,
            },
            { marginLeft: 40 },
          ]}
          onPress={() => !showRegistration && handleButtonPress()}
        >
          <Text style={{ color: COLORS.black, fontSize: SIZES.large }}>
            Registrierung
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttonSwitch,
            {
              backgroundColor: showRegistration ? COLORS.white : COLORS.primary,
            },
            { marginRight: 40 },
          ]}
          onPress={() => showRegistration && handleButtonPress()}
        >
          <Text style={{ color: COLORS.black, fontSize: SIZES.large }}>
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

export default AuthScreen;
