import { Icon, Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAuth } from "../authentification/AuthContext";
import { checkAuthentification } from "../authentification/CheckAuthentification";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
  Image,
} from "react-native";
import { navigate } from '../navigation/NavigationService';


const AppTopBar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const canGoBack = navigation.canGoBack();
  const { logout } = useAuth();
  const isAuthenticated = checkAuthentification();

  let headerTitle: string;

  if (route.name === "Imprint") {
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
    headerTitle = "Activate account";
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
          <TouchableOpacity onPress={() => handleBack()}>
            <Icon
              as={Ionicons}
              name="arrow-back"
              size="xl"
              color={COLORS.black}
            />
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
              <Icon
                as={Ionicons}
                name="information-circle-outline"
                size="sm"
                color={COLORS.black}
              />
            </TouchableOpacity>
          )}
        </View>
        {isAuthenticated ? (<TouchableOpacity onPress={logout}>
          <Text>Logout</Text>
        </TouchableOpacity>) : (<View className="w-6" />)}
      </View>
    </SafeAreaView>
  );
};
export default AppTopBar;
