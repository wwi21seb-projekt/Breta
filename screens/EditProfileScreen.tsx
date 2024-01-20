import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { COLORS, SHADOWS } from "../theme";
import FloatingTextInput from "../components/FloatingTextInput";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { baseUrl } from "../env";
import { Icon } from "native-base";
import { User } from "../components/types/User";

type RouteParams = {
  user: User;
}

const EditProfileScreen = () => {
  const route = useRoute();
  const params = route.params as RouteParams;
  const user = params.user;
  const [error, setError] = useState("");
  const [errorText, setErrorText] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [isInfoChangeSuccessful, setIsInfoChangeSuccessful] =useState(false);
  const [nickname, setNickname] = useState(user?.nickname);
  const [status, setStatus] = useState(user?.status);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [containsSpecialChar, setContainsSpecialChar] = useState(false);
  const [isPasswordFieldVisible, setIsPasswordFieldVisible] = useState(false);
  const [nicknameHeight, setNicknameHeight] = useState();
  const [statusHeight, setStatusHeight] = useState();
  
  const specialCharacter = /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/;

  const maxCharactersNickname = 25;
  const maxCharactersStatus = 256;

  const checkSpecialChar = () => {
    if (specialCharacter.test(newPassword)) {
      setContainsSpecialChar(true);
      setErrorText("")
    }
    else {
      setContainsSpecialChar(false);
      setErrorText("Dein neues Passwort muss mindestens 1 Sonderzeichen enthalten!")
    }
  };
 
  const handleTrivialInfoChange = async () => {
    let response;

    try {
      response = await fetch(`${baseUrl}users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname, 
          status    
        })
      });

      if (response.ok) {
        setIsInfoChangeSuccessful(true);
        setTimeout(() => {
          setIsInfoChangeSuccessful(false);
        }, 3000);
      } else {
        switch (response.status) {
          case 400:
            setError("Deine Profildaten konnten nicht aktualisiert werden. Versuche es später erneut.");
            break;
          case 401:
            setError("Auf das Login Popup navigieren!");
            break;
          default:
            setError("Etwas ist schiefgelaufen. Versuche es später erneut.")
        }
      }
    } catch (error) {
      setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
    }
  };
      


  const handlePasswordChange = async () => {
    let response;

    try {
      response = await fetch(`${baseUrl}users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword, 
          newPassword    
        })
      });

      if (response.ok) {
        setIsPasswordFieldVisible(false);
        setConfirmText("Dein Passwort wurde erfolgreich geändert.");
        setTimeout(() => {
          setConfirmText("");
        }, 3000);
      } else {
        switch (response.status) {
          case 400:
            setIsPasswordFieldVisible(false);
            setConfirmText("Dein Passwort konnte nicht geändert werden. Versuche es später erneut.");
            setTimeout(() => {
              setConfirmText("");
            }, 3000);
            break;
          case 401:
            setError("Auf das Login Popup navigieren!");
            break;
          case 403: 
            setOldPassword("");
            setErrorText("Dein altes Passwort stimmt nicht!");
            setTimeout(() => {
              setErrorText("");
            }, 3000);
            break;      
          default:
            setIsPasswordFieldVisible(false);
            setConfirmText("Dein Passwort konnte nicht geändert werden. Versuche es später erneut.");
            setTimeout(() => {
              setConfirmText("");
            }, 3000);
        }
      }
    } catch (error) {
      setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
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

  const handleNewPassword = () => {
    setErrorText("")
    if (newPassword !== ""){
      if (newPassword.length  < 8){
        setErrorText("Dein neues Passwort muss mindestens 8 Zeichen lang sein!");
      }
      else {
        checkSpecialChar();
      }
  }
   if (confirmNewPassword !== "") {
      if (newPassword !== confirmNewPassword) {
        setErrorText("Die Passwörter stimmen nicht überein!");
      }
    }
  };

  const handleConfirmNewPassword = () => {
    setErrorText("")
    if (newPassword !== "") {
      if (newPassword !== confirmNewPassword) {
        setErrorText("Die Passwörter stimmen nicht überein!");
      }
    }
  };


  useFocusEffect(
    React.useCallback(() => {
      setIsPasswordFieldVisible(false);
      setConfirmText("");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setIsInfoChangeSuccessful(false);
      setContainsSpecialChar(false);
    }, []),
  );

  if (error !== "") {
    return (
      <View className="p-6 bg-white h-full">
        <Text className="text-base">{error}</Text>
      </View>
    );
  } else if (user !== undefined) {
    return (
      <ScrollView className="bg-white" automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
        <View className="items-center">
          <Image
            source={require("../assets/images/Max.jpeg")}
            // source={user?.profilePictureUrl} sobald die Bilder gehen
            className="w-3/5 h-36 rounded-full mt-8 mb-3"
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
            className="text-center text-2xl"
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
          <Text className="self-center mx-6 text-xs text-green">
            Dein Nickname und Status wurden erfolgreich aktualisiert!
          </Text>
        )}

        <View className="bg-white">
          <TouchableOpacity
            className="flex-row mt-6 ml-8 mb-3 items-center"
            onPress={() => {
              setIsPasswordFieldVisible(!isPasswordFieldVisible);
              setConfirmText("");
              setErrorText("");
              setOldPassword("");
              setNewPassword("");
              setConfirmNewPassword("");
            }}
          >
            {isPasswordFieldVisible && (
              <Icon
                as={Ionicons}
                name="chevron-down-outline"
                size="sm"
                color={COLORS.darkgray}
              />
            )}
            {!isPasswordFieldVisible && (
              <Icon
                as={Ionicons}
                name="chevron-forward-outline"
                size="sm"
                color={COLORS.darkgray}
              />
            )}

            <Text className="ml-1 text-darkgray text-base">
              Neues Passwort festlegen
            </Text>
          </TouchableOpacity>
        </View>

        {confirmText !== "" && (
          <Text className="ml-8 text-xs" style={{color: confirmText === "Dein Passwort wurde erfolgreich geändert." ? COLORS.green : COLORS.red}}>
            {confirmText}
          </Text>
        )}

        {isPasswordFieldVisible && (
          <View className="bg-white">
            <FloatingTextInput
              textContentType="oneTimeCode"
              secureTextEntry={true}
              label="Altes Passwort"
              value={oldPassword}
              onChangeText={(text: any) => {
                setOldPassword(text);
              }}
            />
            <FloatingTextInput
              textContentType="oneTimeCode"
              secureTextEntry={true}
              label="Neues Passwort"
              value={newPassword}
              onChangeText={(text: any) => {
                setNewPassword(text);
              }}
              onBlur={handleNewPassword}
            />
            <FloatingTextInput
              textContentType="oneTimeCode"
              secureTextEntry={true}
              label="Neues Passwort bestätigen"
              value={confirmNewPassword}
              onChangeText={(text: any) => {
                setConfirmNewPassword(text);
              }}
              onBlur={handleConfirmNewPassword}
            />
            {errorText && (
              <Text className="self-center mx-6 text-xs text-red mb-4">{errorText}</Text>
            )}
            <TouchableOpacity
              className="items-center mt-6 mb-20 mx-20 py-3 rounded-full"
              style={[
                {
                  backgroundColor:
                    oldPassword !== "" &&
                    newPassword.length >= 8 &&
                    newPassword == confirmNewPassword &&
                    containsSpecialChar
                      ? COLORS.primary
                      : COLORS.lightgray,
                },
              ]}
              onPress={handlePasswordChange}
              disabled={
                oldPassword === "" ||
                newPassword.length < 8 ||
                newPassword !== confirmNewPassword ||
                !containsSpecialChar 
              }
            >
              <Text className="text-base">Passwort ändern</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  } else {
    return (
    <View className="p-6 bg-white h-full">
      <Text className="text-base">Etwas ist schiefgelaufen. Versuche es später erneut.</Text>
    </View>
  );
    }
    
};

export default EditProfileScreen;
