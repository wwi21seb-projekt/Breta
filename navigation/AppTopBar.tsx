import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../theme";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
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
import { useCallback, useEffect, useState } from "react";
import { baseUrl } from "../env";

const AppTopBar = () => {
  const { token } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const canGoBack = navigation.canGoBack();
  const { logout } = useAuth();
  const isAuthenticated = useCheckAuthentication();
  const [notificationCount, setNotificationCount] = useState(0);

  let headerTitle: string;

  // Set the title of the header based on the current route
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
  } else if (route.name === "Notifications") {
    headerTitle = "Notifications";
  } else if (route.name === "SetReset") {
    headerTitle = "Reset password";
  } else if (route.name === "ChatDetail") {
    headerTitle = "Chat";
  } else {
    headerTitle = "";
  }

  // Handle the back navigation
  const handleBack = () => {
    if (route.name === "Authentification") {
      navigate("Feed");
    } else {
      navigation.goBack();
    }
  };

  // Update notifications periodically and when the screen is focused
  useEffect(() => {
    updateNotifications(); 
    const intervalId = setInterval(updateNotifications, 60000); 

    return () => clearInterval(intervalId);
  }, [token]); 

  useFocusEffect(
    useCallback(() => {
      updateNotifications();
    }, [route, navigation]) 
  );

  // Fetch and update the notification count
  const updateNotifications = async () => {
    let response;

    try {
      response = await fetch(`${baseUrl}notifications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      let data = await response.json();
      switch (response.status) {
        case 200:
          setNotificationCount(await data.records.length);
          break;
        case 401:
          setNotificationCount(0);
          break;
        default:
          setNotificationCount(0);
      }
    } catch (error) {
      setNotificationCount(0);
    }
  }

  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
        backgroundColor: "white",
      }}
    >
      <View className="flex-row px-3 h-12 items-center mb-2">
        <View className="flex-1">
          {/* Back button handling */}
          {canGoBack ? (
            <TouchableOpacity onPress={() => handleBack()}>
              <Ionicons name="arrow-back" size={28} color={COLORS.black} />
            </TouchableOpacity>
          ) : (
            <></>
          )}
          {/* Notifications button */}
          {isAuthenticated && headerTitle === "" && !canGoBack ? (
            <TouchableOpacity onPress={() => navigate("Notifications")}>
              <Ionicons name="notifications-outline" size={28} />
              {notificationCount > 0 && (
                <View className="absolute left-0 top-0 w-7 h-7 items-center justify-center">
                  {notificationCount < 10 ? (
                    <Text className="text-primary text-[8px] font-bold">{notificationCount}</Text>
                  ) : 
                  <Text className="text-primary text-[8px] font-bold">9+</Text>}
                </View>
              )}
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>

        <View className="flex-2">
          {/* Header title or logo */}
          {headerTitle !== "" ? (
            <Text className="text-xl font-bold">{headerTitle}</Text>
          ) : (
            <TouchableOpacity onPress={() => navigate("Imprint")} className="flex-row h-9">
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
        <View className="flex-1 items-end">
          {/* Logout button */}
          {isAuthenticated && headerTitle === "" && !canGoBack ? (
            <TouchableOpacity onPress={logout}>
              <Ionicons name="log-out-outline" size={26} color={COLORS.black} />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AppTopBar;
