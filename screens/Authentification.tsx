import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SIZES, COLORS } from "../constants/theme";
import styles from "../constants/styles";
import Register from "../components/Register";
import Login from "../components/Login";

const AuthScreen = () => {
  const [showRegistration, setShowRegistration] = useState(true);

  const handleButtonPress = () => {
    setShowRegistration(!showRegistration);
  };

  return (
    <View style={{ flex: 1, marginTop: 60 }}>
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
    </View>
  );
};

export default AuthScreen;
