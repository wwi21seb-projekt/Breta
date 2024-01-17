import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../theme';
import FloatingTextInput from '../components/FloatingTextInput';
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import axios from "axios";
import { baseUrl } from "../env";
import { Icon } from "native-base";


const dummyUser = {
  image: require("../assets/images/Kevin.jpeg"),
  nickname: "DübelDoc",
  username: "top_G_3",
  status: "Wer den Dübel nicht ehrt, ist die Sneak nicht wert!"
}

const EditProfileScreen = () => {
  const [casualError, setCasualError] = useState(false);
  const [notAuthorized, setNotAuthorized] = useState(false);
  const [nickname, setNickname] = useState(dummyUser.nickname);
  const [status, setStatus] = useState(dummyUser.status);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isChangeSuccess, setIsChangeSuccess] = useState(false);
  const [nicknameHeight, setNicknameHeight] = useState();
  const [statusHeight, setStatusHeight] = useState();
  const [errorText, setErrorText] = useState("");

  const maxCharactersNickname = 25;
  const maxCharactersStatus = 256;


const handleTrivialInfoChange = () => {
  axios
      .put(`${baseUrl}users/`, {
        nickname: nickname,
        status: status,
      })
      .then(function (response) {
        if (response.status == 200) {
          console.log("Passt")
        }
      })
      .catch(function (error) {
        switch (error.response.status) {
          case 400: {
            setCasualError(true);
            break;
          }
          case 401: {
            setNotAuthorized(true);
            break;
          }
          default: {
            setCasualError(true);
            break;
          }
        }
      });
  };

  const handlePasswordChange = () => {
    axios
      .patch(`${baseUrl}users/`, {
        oldPassword: oldPassword,
        newPassword: newPassword,
      })
      .then(function (response) {
        if (response.status == 200) {
          setIsPasswordVisible(!isPasswordVisible); 
          setIsChangeSuccess(true)
        }
      })
      .catch(function (error) {
        switch (error.response.status) {
          case 400: {
            setCasualError(true);
            break;
          }
          case 401: {
            setNotAuthorized(true);
            break;
          }
          case 403: {
            setOldPassword("");
            setErrorText("Dein altes Passwort stimmt nicht!");
            break;
          }
          default: {
            setCasualError(true);
            break;
          }
        }
      });
  };

  const onNicknameContentSizeChange = (event: any) => {
    setNicknameHeight(event.nativeEvent.contentSize.height);
  };

  const onStatusContentSizeChange = (event: any) => {
    setStatusHeight(event.nativeEvent.contentSize.height);
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
    if (confirmNewPassword !== "") {
      if(newPassword !== confirmNewPassword){
        setErrorText("Die Passwörter stimmen nicht überein!")
      }
    }
  };

  const handleConfirmNewPassword = () => {
    setErrorText("")
    if (newPassword !== "") {
      if(newPassword !== confirmNewPassword){
        setErrorText("Die Passwörter stimmen nicht überein!")
      }
    }
  };



  useFocusEffect(
    React.useCallback(() => {
      setIsPasswordVisible(false);
      setIsChangeSuccess(false);
      
      return () => {
        setIsPasswordVisible(false);
        setIsChangeSuccess(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      };
    }, [])
  );

  if (notAuthorized) {
    return (
      <SafeAreaView className="flex bg-white justify-center items-center">
        <Text className="text-lg">Du musst dich erst anmelden</Text>
        {/* <TouchableOpacity
          style={styles.errorButton}
          onPress={() => navigation.navigate("Authentification" as never)}
        >
          Anmelden
        </TouchableOpacity> */}
      </SafeAreaView>
    );
  } else if (casualError) {
    return (
      <SafeAreaView className="flex bg-white justify-center items-center">
        <Text className="text-lg">Es ist ein Fehler aufegtreten. Versuche es später erneut!</Text>
      </SafeAreaView>
    );
  } else

  return (
    <ScrollView className="bg-white">
      <View className="items-center">
      <Image
          source={dummyUser.image}
          className="w-3/5 h-36 rounded-full mt-8 mb-3"
        
        />
         </View>
         <Text  className="text-base text-darkgray self-center mb-4" 
              >@{dummyUser.username}</Text> 
        <View className="text-center bg-white p-2 mx-16 mb-3 rounded-2xl" style={{...SHADOWS.medium}}>
        <TextInput
            className="text-center text-2xl"
          style={{height: nicknameHeight}}
          value={nickname}
          onChangeText={handleNicknameChange}
          onBlur={handleTrivialInfoChange}
          placeholder="Nickname"
          multiline 
          numberOfLines={1} 
          onContentSizeChange={onNicknameContentSizeChange}
        />
        <Text 
        className="self-center mt-1 text-xs" 
        >{nickname.length} / {maxCharactersNickname}</Text>
        </View>

<View className="text-center bg-white p-2 mx-16 mb-3 rounded-2xl" style={{...SHADOWS.medium}}>
        <TextInput
         className="text-center text-base"
          style={{height: statusHeight}}
          value={status}
          onChangeText={handleStatusChange}
          onBlur={handleTrivialInfoChange}
          placeholder="Status"
          multiline 
          numberOfLines={1} 
          onContentSizeChange={onStatusContentSizeChange}
        />
         <Text className="self-center mt-1 text-xs" >{status.length} / {maxCharactersStatus}</Text>
        </View>
    

      <View className="bg-white">
      <TouchableOpacity className="flex-row mt-6 ml-8 mb-3 items-center" onPress={() => {setIsPasswordVisible(!isPasswordVisible); setIsChangeSuccess(false)}}>
        {isPasswordVisible && (
          <Icon as={Ionicons} name="chevron-down-outline" size="sm" color={COLORS.darkgray} />
        )}
        {!isPasswordVisible && (
          <Icon as={Ionicons} name="chevron-forward-outline" size="sm" color={COLORS.darkgray}/>
        )}
      
        <Text className="ml-1 text-darkgray text-base">Neues Passwort festlegen</Text>
      </TouchableOpacity>
      </View>

      {isChangeSuccess && (
          <Text className="my-44 text-green">Das Passwort wurde erfolgreich geändert!</Text>
        )}

      {isPasswordVisible && (
        <View className="bg-white">
          <FloatingTextInput 
            secureTextEntry={true}
            label="Altes Passwort"
            value={oldPassword}
            onChangeText={(text: any) => {
              setOldPassword(text);
            }}/>
          <FloatingTextInput 
            secureTextEntry={true}
            label="Neues Passwort"
            value={newPassword}
            onChangeText={(text: any) => {
              setNewPassword(text);
            }}
            onBlur={handleNewPassword}/>
          <FloatingTextInput 
            secureTextEntry={true}
            label="Neues Passwort bestätigen"
            value={confirmNewPassword}
            onChangeText={(text: any) => {
              setConfirmNewPassword(text);
            }}
            onBlur={handleConfirmNewPassword}/>
            {errorText && <Text className="ml-44 text-red mb-24">{errorText}</Text>}
          <TouchableOpacity 
          className="items-center mt-6 mb-8 mx-20 py-3 rounded-full" 
          style={[
              {
                backgroundColor:
                oldPassword.length >= 8 &&
                newPassword.length >= 8 &&
                newPassword == confirmNewPassword
                    ? COLORS.primary
                    : COLORS.lightgray,
              },
            ]} onPress={handlePasswordChange} disabled={
               oldPassword.length < 8 || newPassword.length < 8 || newPassword !== confirmNewPassword
            }>
        <Text className="text-base">Passwort ändern</Text>
          </TouchableOpacity>
          
        </View>
      )}
    </ScrollView>
  );
};

export default EditProfileScreen;
