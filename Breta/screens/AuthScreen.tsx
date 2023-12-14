import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import styles from '../constants/styles';
import FloatingTextInput from '../components/FloatingTextInput';
import { SIZES, SHADOWS, COLORS} from '../constants/theme';
import axios from 'axios'
import Register from '../components/Register';
import { useNavigation } from "@react-navigation/native";


const styleS = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  root:{
    flex: 1, 
    padding: 20, 
    alignContent: 'center', 
    justifyContent: 'center'
  }
});

const AuthScreen = () => {

  
 
  const navigation = useNavigation();
  const [showRegistration, setShowRegistration] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [isEmailFilled, setIsEmailFilled] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleButtonPress = () => {
    setShowRegistration(!showRegistration);
  };

  const handleLogin = () => {
    axios
      .post(`${baseUrl}users/login`, {
        email: email,
        password: password,
      })
      .then(function (response) {
        if (response.status == 200) {
          navigation.navigate("Feed" as never);
        }
      })
      .catch(function (error) {
        switch (error.response.status) {
          case 401: {
            console.log("Bitte bestätige erst deinen Code");
            //weiterleiten auf code eingeben page
            break;
          }
          case 403: {
            setError("Die Email-Adresse oder das Passwort ist falsch");
            // hier eventuell Email und Passwort Input leeren
            break;
          }
          case 404: {
            setError("Die Email-Adresse oder das Passwort ist falsch");
            // hier eventuell Email und Passwort Input leeren
            break;
          }
        }
      });
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
        <Register></Register>
      ) : (
        <View>
          <FloatingTextInput
            label="Email Adresse"
            value={email}
            onChangeText={(text: any) => {
              setEmail(text);
              setIsEmailFilled(!!text);
              setErrorEmail("");
            }}
            onBlur={() => {
              if (!emailRegex.test(email)) {
                setErrorEmail("Die Email-Adresse hat keine korrekte Form!");
              }
            }}
          />
          {errorEmail && <Text style={styles.error}>{errorEmail}</Text>}
          <FloatingTextInput
            secureTextEntry={true}
            label="Passwort"
            value={password}
            onChangeText={(text: any) => {
              setPassword(text);
            }}
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity
            style={[
              styles.loginButton,
              {
                backgroundColor:
                  isEmailFilled &&
                  emailRegex.test(email) &&
                  password.length >= 8
                    ? COLORS.primary
                    : COLORS.lightgray,
              },
            ]}
            onPress={handleLogin}
            disabled={
              !isEmailFilled || !emailRegex.test(email) || password.length < 8
            }
          >
            <Text style={{ color: COLORS.black, fontSize: SIZES.large }}>
              Einloggen
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AuthScreen;

