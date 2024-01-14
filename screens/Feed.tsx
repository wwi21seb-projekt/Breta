import { View, TouchableOpacity, Text } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { COLORS, SIZES, SHADOWS } from "../constants/theme";

type RootStackParamList = {
  Auth: undefined;
};

type FeedScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Auth">;
};

const FeedScreen: React.FC<FeedScreenProps> = ({ navigation }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.white,
      }}
    >
      <Text style={{ marginBottom: 30 }}>Das ist die Feed Seite</Text>
      <TouchableOpacity
        style={{
          backgroundColor: COLORS.primary,
          padding: 12,
          borderRadius: 18,
          ...SHADOWS.medium,
        }}
        onPress={() => navigation.navigate("Authentification" as never)}
      >
        <Text style={{ color: COLORS.black, fontSize: SIZES.large }}>
          Registrierung / Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FeedScreen;
