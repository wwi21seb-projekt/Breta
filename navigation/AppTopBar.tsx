import { Icon, HStack, Text, Center } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView, TouchableOpacity, View } from "react-native";

type RootStackParamList = {
  Home: undefined;
  Impressum: undefined;
};

type AppTopBarProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const AppTopBar: React.FC<AppTopBarProps> = ({ navigation }) => {
  const route = useRoute();

  const canGoBack = navigation.canGoBack();

  let headerTitle;

  if (route.name === "Impressum") {
    headerTitle = <Text className="text-lg font-bold">Impressum</Text>;
  } else if (route.name === "Authentification") {
    headerTitle = <Text className="text-lg font-bold">Authentifikation</Text>;
  } else if (route.name === "FollowerList") {
    headerTitle = <Text className="text-lg font-bold">Follower</Text>;
  } else if (route.name === "FollowedList") {
    headerTitle = <Text className="text-lg font-bold">Gefolgt</Text>;
  } else if (route.name === "FriendRequest") {
    headerTitle = (
      <Text className="text-lg font-bold">Freundschaftsanfragen</Text>
    );
  } else if (route.name === "ConfirmCode") {
    headerTitle = <Text className="text-lg font-bold">Login</Text>;
  } else {
    headerTitle = (
      <Text fontSize="20" fontWeight="bold">
        BRE<Text style={{ color: "aqua" }}>T</Text>A
      </Text>
    );
  }

  return (
    <SafeAreaView className="bg-white">
      <HStack className="px-3 py-1">
        <View className="flex-1 justify-center">
          {canGoBack && (
            <TouchableOpacity
              className="self-start"
              onPress={() => navigation.goBack()}
            >
              <Icon as={Ionicons} name="arrow-back" size="xl" color="black" />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-2 justify-center">{headerTitle}</View>

        <View className="flex-1 justify-center">
          <TouchableOpacity
            className="self-end"
            onPress={() => navigation.navigate("Impressum")}
          >
            <Icon
              as={Ionicons}
              name="information-circle-outline"
              size="lg"
              color="black"
            />
          </TouchableOpacity>
        </View>
      </HStack>
    </SafeAreaView>
  );
};
export default AppTopBar;
