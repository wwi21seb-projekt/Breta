import { Icon, HStack, Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme";
import { useRoute, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
  Image,
} from "react-native";

type RootStackParamList = {
  Feed: undefined;
  Impressum: undefined;
};
type NavigationType = StackNavigationProp<RootStackParamList, "Feed">;

const AppTopBar = () => {
  const navigation = useNavigation<NavigationType>();
  const route = useRoute();
  const canGoBack = navigation.canGoBack();

  let headerTitle: string;

  if (route.name === "Impressum") {
    headerTitle = "Imprint";
  } else if (route.name === "Authentification") {
    headerTitle = "Authentification";
  } else if (route.name === "FollowerList") {
    headerTitle = "Follower";
  } else if (route.name === "FollowedList") {
    headerTitle = "Followed";
  } else if (route.name === "FriendRequest") {
    headerTitle = "Friend requests";
  } else if (route.name === "ConfirmCode") {
    headerTitle = "Login";
  } else {
    headerTitle = "";
  }

  const handleBack = () => {
    if (route.name === "Authentification") {
      navigation.navigate("Feed");
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView
      className="bg-white"
      style={{
        paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
      }}
    >
      <HStack className="px-3 h-12 mb-2">
        <View className="flex-1 justify-center">
          {canGoBack && (
            <TouchableOpacity
              className="self-start"
              onPress={() => handleBack()}
            >
              <Icon
                as={Ionicons}
                name="arrow-back"
                size="xl"
                color={COLORS.black}
              />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-2 justify-center">
          {headerTitle !== "" ? (
            <Text className="text-xl font-bold">{headerTitle}</Text>
          ) : (
            <Image
              source={require("../assets/images/Breta_Logo.png")}
              className="w-20 h-full"
            />
          )}
        </View>

        <View className="flex-1 justify-center">
          <TouchableOpacity
            className="self-end"
            onPress={() => navigation.navigate("Impressum")}
          >
            {headerTitle !== "Impressum" && (
              <Icon
                as={Ionicons}
                name="information-circle-outline"
                size="lg"
                color={COLORS.black}
              />
            )}
          </TouchableOpacity>
        </View>
      </HStack>
    </SafeAreaView>
  );
};
export default AppTopBar;
