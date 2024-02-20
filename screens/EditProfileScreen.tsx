import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { SHADOWS } from "../theme";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { baseUrl } from "../env";
import { User } from "../components/types/User";
import ErrorComp from "../components/ErrorComp";
import { useAuth } from "../authentification/AuthContext";

type RouteParams = {
  user: User;
};

const EditProfileScreen = () => {
  const route = useRoute();
  const params = route.params as RouteParams;
  const user = params.user;
  
  const {token} = useAuth();
  const [errorText, setErrorText] = useState("");
  const [isInfoChangeSuccessful, setIsInfoChangeSuccessful] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname);
  const [status, setStatus] = useState(user?.status);
  const [nicknameHeight, setNicknameHeight] = useState();
  const [statusHeight, setStatusHeight] = useState();


  const maxCharactersNickname = 25;
  const maxCharactersStatus = 256;

  

  const handleTrivialInfoChange = async () => {
    let response;
    let data;
    try {
      response = await fetch(`${baseUrl}users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          nickname: nickname,
          status: status
        }),
      });
      data = await response.json();
        switch (response.status) {
          case 200:
            setIsInfoChangeSuccessful(true);
            setTimeout(() => {
            setIsInfoChangeSuccessful(false);
            }, 3000);
            break;
          case 400:
            setErrorText(data.error.message);
            break;
          case 401:
            setErrorText(data.error.message);
            break;
          default:
            setErrorText("Something went wrong. Please try again.");
        }
    } catch (error) {
      console.log(error);
      setErrorText("Connection error. Please try again.");
    }
  };

 

  const onNicknameContentSizeChange = (event: any) => {
    setNicknameHeight(event.nativeEvent.contentSize.height + 10);
  };

  const onStatusContentSizeChange = (event: any) => {
    setStatusHeight(event.nativeEvent.contentSize.height + 10);
  };

  const handleNicknameChange = (text: string) => {
    if (text.length <= maxCharactersNickname) {
      setNickname(text);
    }
  };

  const handleStatusChange = (text: string) => {
    if (text.length <= maxCharactersStatus) {
      setStatus(text);
    }
  };

  

  useFocusEffect(
    React.useCallback(() => {
      setIsInfoChangeSuccessful(false);
    }, []),
  );

  if (errorText !== "") {
    return (
      <ErrorComp errorText={errorText} />
    );
  } else if (user !== undefined) {
    return (
      <ScrollView
        className="bg-white"
        automaticallyAdjustKeyboardInsets={true}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center">
          <Image
            source={require("../assets/images/Max.jpeg")}
            // source={user?.profilePictureUrl} sobald die Bilder gehen
            className="w-3/5 h-36 rounded-full mt-8 mb-3"
            alt="Profilbild"
          />
        </View>
        <Text className="italic text-lg text-darkgray self-center mb-4">
          @{user?.username}
        </Text>
        <View
          className="text-center bg-white p-2 mx-16 mb-3 rounded-2xl"
          style={{ ...SHADOWS.small }}
        >
          <TextInput
            className="text-center text-xl"
            style={{ height: nicknameHeight }}
            value={nickname}
            onChangeText={handleNicknameChange}
            onBlur={handleTrivialInfoChange}
            placeholder="Nickname"
            multiline
            numberOfLines={1}
            onContentSizeChange={onNicknameContentSizeChange}
          />
          <Text className="self-center mt-1 text-xs">
            {nickname?.length} / {maxCharactersNickname}
          </Text>
        </View>

        <View
          className="text-center bg-white p-2 mx-16 mb-3 rounded-2xl"
          style={{ ...SHADOWS.small }}
        >
          <TextInput
            className="text-center text-base"
            style={{ height: statusHeight }}
            value={status}
            onChangeText={handleStatusChange}
            onBlur={handleTrivialInfoChange}
            placeholder="Status"
            multiline
            numberOfLines={1}
            onContentSizeChange={onStatusContentSizeChange}
          />
          <Text className="self-center mt-1 text-xs">
            {status?.length} / {maxCharactersStatus}
          </Text>
        </View>
        {isInfoChangeSuccessful && (
          <Text className="self-center mx-10 mt-1 text-xs text-green">
            Your nickname and status have been updated successfully!
          </Text>
        )}
      </ScrollView>
    );
  } else {
    return (
      <ErrorComp errorText="Something went wrong. Please try again." />
    );
  }
};

export default EditProfileScreen;
