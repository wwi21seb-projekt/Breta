import { useState, useEffect, useRef } from "react";
import { Text, View, Platform, FlatList } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useAuth } from "../authentification/AuthContext";
import { baseUrl } from "../env";
import { Notification } from "../components/types/Notification"
import NotificationTab from "../components/NotificationTab";
import { useIsFocused } from "@react-navigation/native";
import ErrorComp from "../components/ErrorComp";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/*async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}*/

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!",
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

const NotificationScreen = () =>  {
  const { token} = useAuth();
  const [notification, setNotification] = useState<
   Notifications.Notification | undefined
  >(undefined);
  const [notificationUser, setNotificationUser] = useState<Notification[]>([])
  const [errorText, setErrorText] = useState("")
  const [refreshing, setRefreshing] = useState(false);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchNotifications();
    }

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [isFocused]);

  const onRefresh = () => {

    setRefreshing(true);
    fetchNotifications()
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const fetchNotifications = async () => {

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
      let userNotification
      switch (response.status) {
        case 200:
          userNotification = await data.records 
          setNotificationUser(userNotification)
          break;
        case 401:
          setErrorText(data.error.message)
          break;
        default:
          setErrorText("Something went wrong, please try again later.")
      }
    } catch (error) {
      setErrorText(
        "There are issues communicating with the server, please try again later.",
      );
    }
    
  }
  if (errorText !== "") {
    return <ErrorComp errorText={errorText} />;
  }
  else{
  return (
    <View className="flex-1 bg-white">
      {notificationUser.length > 0 ? (
        <FlatList
        data={notificationUser}
        keyExtractor={(item) => item.notificationId}
        renderItem={({ item }) => (
          <NotificationTab
            notificationId={item.notificationId}
            timestamp={item.timestamp}
            notificationType={item.notificationType}
            username={item.user.username}
            profilePictureUrl={item.user.profilePictureUrl}
            onRefresh={onRefresh}
          />
        )}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.2}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}></RefreshControl>}
        className="bg-white"
      ></FlatList>
      ) : (
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}></RefreshControl>}>
        <View className="items-center justify-center">
           <Text className="text-lg text-lightgray">You have no new notifications!</Text>      
        </View>
        </ScrollView>
        )}
        
    </View>
      );
}
}

export default NotificationScreen;
