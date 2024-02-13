import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FloatingLabelInput from "./FloatingLabelInput";
import { baseUrl } from "../env";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { COLORS } from "../theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { Dispatch, SetStateAction } from "react";

interface Props {
  setServerError: Dispatch<SetStateAction<string>>;
}

type RootStackParamList = {
  ConfirmCode: undefined;
  Feed: undefined;
};
type NavigationType = StackNavigationProp<RootStackParamList, "ConfirmCode">;

const Login: React.FC<Props> = ({ setServerError }) => {
  const navigation = useNavigation<NavigationType>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [errorTextUsername, setErrorTextUsername] = useState("");
  const [confirmCodeText, setConfirmCodeText] = useState("");
  const [isUsernameFilled, setIsUsernameFilled] = useState(false);
  const [isPasswordFilled, setIsPasswordFilled] = useState(false);

  const handleLogin = async () => {
    let response;
    let data;
    try {
      response = await fetch(`${baseUrl}users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      data = await response.json();
      switch (response.status) {
        case 200:
          try {
            await AsyncStorage.setItem("token", data.token);
            await AsyncStorage.setItem("refreshToken", data.refreshToken);
          } catch (error) {
            setServerError("Something went wrong. Please try again.");
          }
          navigation.navigate("Feed");
          break;
        case 401:
          setErrorTextUsername("error");
          setErrorText(data.error.message);
          break;
        case 403:
          setConfirmCodeText(data.error.message);
          break;
        case 404:
          setErrorTextUsername("error");
          setErrorText(data.error.message);
          break;
        default:
          setServerError("Something went wrong. Please try again.");
      }
    } catch (error) {
      setServerError("Connection error. Please try again.");
    }
  };

  return (
    <ScrollView
      className="bg-white px-10"
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={false}
    >
      <FloatingLabelInput
        errorText={errorTextUsername}
        noErrorText={true}
        label="Username"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          setIsUsernameFilled(!!text);
        }}
      />
      <FloatingLabelInput
        errorText={errorText}
        textContentType="oneTimeCode"
        secureTextEntry={true}
        label="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setIsPasswordFilled(!!text);
        }}
      />
      {!!confirmCodeText && 
      <View className="flex-row">
        <Text className="text-sm text-red my-1 ml-4">{confirmCodeText} Confirm code </Text>
          <TouchableOpacity onPress={()=>navigation.navigate("ConfirmCode")}>
            <Text className="text-primary underline text-sm my-1">here</Text>
          </TouchableOpacity>
        </View>
      }
      <TouchableOpacity
        style={{
          backgroundColor:
            isUsernameFilled && isPasswordFilled
              ? COLORS.primary
              : COLORS.lightgray,
        }}
        className="p-3 mt-12 items-center rounded-xl mx-24"
        onPress={handleLogin}
        disabled={!isUsernameFilled || !isPasswordFilled}
      >
        <Text className="text-base">Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Login;
