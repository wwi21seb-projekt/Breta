import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import FloatingLabelInput from "./FloatingLabelInput";
import { useState } from "react";
import { COLORS } from "../theme";
import { Dispatch, SetStateAction } from "react";
import { useAuth } from "../authentification/AuthContext";
import { navigate } from "../navigation/NavigationService";

interface Props {
  setServerError: Dispatch<SetStateAction<string>>;
}

const Login: React.FC<Props> = ({ setServerError }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorTextLogin, setErrorTextLogin] = useState("");
  const [errorTextUsername, setErrorTextUsername] = useState("");
  const [confirmCodeText, setConfirmCodeText] = useState("");
  const [isUsernameFilled, setIsUsernameFilled] = useState(false);
  const [isPasswordFilled, setIsPasswordFilled] = useState(false);

  return (
    <ScrollView
      className="bg-white px-10"
      automaticallyAdjustKeyboardInsets={true}
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
        errorText={errorTextLogin}
        textContentType="oneTimeCode"
        secureTextEntry={true}
        label="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setIsPasswordFilled(!!text);
        }}
      />
      {!!confirmCodeText && (
        <>
          <Text className="text-sm text-red my-1 mx-2">{confirmCodeText}</Text>
          <View className="flex-row">
            <Text className="text-sm text-red ml-2">Confirm code </Text>
            <TouchableOpacity onPress={() => navigate("ConfirmCode")}>
              <Text className="text-primary underline text-sm mr-2">here</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <TouchableOpacity
        style={{
          backgroundColor:
            isUsernameFilled && isPasswordFilled
              ? COLORS.primary
              : COLORS.lightgray,
        }}
        className="p-3 mt-12 items-center rounded-xl mx-24"
        onPress={() =>
          login(
            username,
            password,
            setServerError,
            setErrorTextUsername,
            setErrorTextLogin,
            setConfirmCodeText,
          )
        }
        disabled={!isUsernameFilled || !isPasswordFilled}
      >
        <Text className="text-base">Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Login;
