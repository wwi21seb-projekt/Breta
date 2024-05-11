import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../theme";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAuth } from "../authentification/AuthContext";
import { useCheckAuthentication } from "../authentification/CheckAuthentification";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
  Image,
  Text,
} from "react-native";
import { navigate } from "../navigation/NavigationService";

const AppTopBar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const canGoBack = navigation.canGoBack();
  const { logout } = useAuth();
  const isAuthenticated = useCheckAuthentication();

  let headerTitle: string;

  if (route.name === "Imprint") {
    headerTitle = "Imprint";
  } else if (route.name === "Authentification") {
    headerTitle = "Authentification";
  } else if (route.name === "FollowerList") {
    headerTitle = "Follower";
  } else if (route.name === "FollowingList") {
    headerTitle = "Following";
  } else if (route.name === "ConfirmCode") {
    headerTitle = "Activate account";
  } else if (route.name === "EditProfile") {
    headerTitle = "Edit profile";
  } else {
    headerTitle = "";
  }

  const handleBack = () => {
    if (route.name === "Authentification") {
      navigate("Feed");
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
        backgroundColor: "white",
      }}
    >
      <View className="flex-row px-3 h-12 items-center mb-2">
        {canGoBack ? (
          <TouchableOpacity className="w-6" onPress={() => handleBack()}>
            <Ionicons name="arrow-back" size={26} color={COLORS.black} />
          </TouchableOpacity>
        ) : (
          <View className="w-6" />
        )}

        <View className="flex-1 justify-center items-center">
          {headerTitle !== "" ? (
            <Text className="text-xl font-bold">{headerTitle}</Text>
          ) : (
            <TouchableOpacity
              onPress={() => navigate("Imprint")}
              className="flex-row h-9"
            >
              <Image
                source={require("../assets/images/Breta_Logo.png")}
                className="w-20 h-full"
              />
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={COLORS.black}
              />
            </TouchableOpacity>
          )}
        </View>
        {isAuthenticated && headerTitle === "" ? (
          <TouchableOpacity className="w-6" onPress={logout}>
            <Ionicons name="log-out-outline" size={26} color={COLORS.black} />
          </TouchableOpacity>
        ) : (
          <View className="w-6" />
        )}
      </View>
    </SafeAreaView>
  );
};
export default AppTopBar;
