import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../theme";
import { useRoute, useNavigation, useFocusEffect, useIsFocused } from "@react-navigation/native";
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
  const { token} = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const canGoBack = navigation.canGoBack();
  const { logout } = useAuth();
  const isAuthenticated = useCheckAuthentication();
  const [notificationCount, setNotificationCount] = useState(0)
  const isFocused = useIsFocused();

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
  } else if (route.name === "Notifications") {
    headerTitle = "Notifications";
  } else if (route.name === "SetReset") {
    headerTitle = "Reset password";
  } else {
    headerTitle = "";
  }
  //set new Headertitle "Notifications"

  const handleBack = () => {
    if (route.name === "Authentification") {
      navigate("Feed");
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    updateNotifications(); 
    const intervalId = setInterval(updateNotifications, 60000); 

    return () => clearInterval(intervalId);
  }, [token]); 

  useEffect(() => {
    if (isFocused) {
      updateNotifications();
    }
  }, [isFocused, token]); 

  useFocusEffect(
    useCallback(() => {
      updateNotifications();
    }, [route, navigation]) 
  );


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
      let data = await response.json()
      switch (response.status) {
        case 200:
          setNotificationCount(await data.records.length)
          break;
        case 401:
          setNotificationCount(0)
          break;
        default:
          setNotificationCount(0)
      }
    } catch (error) {
      setNotificationCount(0)

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
        {canGoBack ? (
          <TouchableOpacity className="w-6" onPress={() => handleBack()}>
            <Ionicons name="arrow-back" size={26} color={COLORS.black} />
          </TouchableOpacity>
        ) : (
          <></>
        )}
        {isAuthenticated && headerTitle === "" ? (
          <TouchableOpacity
            className="w-6"
            onPress={() => navigate("Notifications")}
          >
            <Ionicons name="notifications-outline" size={27} />
            {notificationCount > 0 && (
            <View className="absolute top-0 right-0 bg-red-600 rounded-full w-[21] h-6 flex items-center justify-center">
              {notificationCount < 10 ? (
              <Text className="text-primary text-sm font-bold">{notificationCount}</Text>
               ) : 
               <Text className="text-primary text-[10px] font-bold">9+</Text>}
            </View>
            )}
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
          <></>
        )}
      </View>
    </SafeAreaView>
  );
};
export default AppTopBar;
