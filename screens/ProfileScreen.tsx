import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { SHADOWS } from "../theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { baseUrl } from "../env";
import {dummyData} from "../DummyData";
import { useNavigation } from '@react-navigation/native';

import axios, { AxiosError } from "axios";


type RootStackParamList = {
  FollowerList: { type: number, users: any };
  Authentification: undefined;
  EditProfile: { user: any };
};

type NavigationType = StackNavigationProp<RootStackParamList, 'FollowerList'>;

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationType>();
  const [userNotFound, setUserNotFound] = useState(false);
  const [notAuthorized, setNotAuthorized] = useState(false);
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [status, setStatus] = useState("");
  // const [profilePicture, setProfilePicture] = useState("");
  const [followerCount, setFollowerCount] = useState("");
  const [followingCount, setFollowingCount] = useState("");
  const [postsCount, setPostsCount] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}users/:username`,
        );
        setUsername(response.data.username);
        setNickname(response.data.nickname);
        setStatus(response.data.status);
        // setProfilePicture(response.data.source);
        setFollowerCount(response.data.follower);
        setFollowingCount(response.data.following);
        setPostsCount(response.data.posts);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            switch (axiosError.response.status) {
              case 401:
                setNotAuthorized(true);
                break;
              case 404:
                setUserNotFound(true);
                break;
              default:
                console.log("Unbekannter Fehler");
            }
          } else {
            console.log("Netzwerkfehler oder keine Antwort vom Server");
          }
        } else {
          console.log("Ein unerwarteter Fehler ist aufgetreten");
        }
      }
    };

    fetchUserData();
  }, []);

  if (notAuthorized) {
    return (
      <SafeAreaView className="flex bg-white justify-center items-center">
        <Text className="text-lg">Du musst dich erst anmelden</Text>
        <TouchableOpacity
        className="bg-primary my-10 px-16 py-8 rounded-xl shadow-md"
          onPress={() => navigation.navigate("Authentification")}
        >
          Anmelden
        </TouchableOpacity>
      </SafeAreaView>
    );
  } else if (userNotFound) {
    return (
      <SafeAreaView className="flex bg-white justify-center items-center">
        <Text className="text-lg">User not found</Text>
      </SafeAreaView>
    );
  } else
    return (
      <SafeAreaView className="flex bg-white">
      <ScrollView>
        <Image source={dummyData[0].avatarUrl} className="w-full h-48" />

        <View className="items-center p-10">
            <Text className="text-xl font-bold">{nickname}</Text>
            <Text className="font-base text-darkgray"
            >
              @{username}
            </Text>
            <Text className="my-4">{status}</Text>
            <TouchableOpacity
              style={{...SHADOWS.medium}}
              className="bg-white my-10 px-12 py-4 rounded-full" 
              onPress={() => navigation.navigate("EditProfile", {user: dummyData[0]})}
            > 
              <Text>Profil bearbeiten</Text>
            </TouchableOpacity>
  
          <View className="w-full justify-center flex-row space-around">
            <View className="items-center justify-center p-3">
              <Text className="font-bold text-base">{postsCount}</Text>
              <Text>Beiträge</Text>
            </View>
            <TouchableOpacity
              className="items-center justify-center p-3"
              onPress={() => navigation.navigate("FollowerList", { type: 0, users:  dummyData})}
            >
              <Text className="font-bold text-base">{followerCount}</Text>
              <Text>Follower</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="items-center justify-center p-3"
              onPress={() => navigation.navigate("FollowerList", { type: 1, users: dummyData })}
            >
              <Text className="font-bold text-base">{followingCount}</Text>
              <Text>Gefolgt</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="items-center justify-center p-3"
              onPress={() => navigation.navigate("FollowerList", { type: 2, users: dummyData })}
            >
              <Text className="font-bold text-base">2</Text>
              <Text>Anfragen</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text className="font-bold text-xl ml-6"
        >
          Beiträge
        </Text>
        <View className="flex-row justify-between flex-wrap mx-6 my-2">
  
          {dummyData[0].posts.map((url, index) => (
            <Image key={index} source={url} className="rounded-3xl aspect-square my-2" style={{width: "47%"}}/>
          ))}
    
        </View>
      </ScrollView>
      </SafeAreaView>
    );
};
export default ProfileScreen;

