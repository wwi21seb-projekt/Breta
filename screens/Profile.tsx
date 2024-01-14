import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { COLORS, SIZES, SHADOWS } from "../constants/theme";
import { StackNavigationProp } from "@react-navigation/stack";

import axios, { AxiosError } from "axios";

const posts = [
  { name: "kevin", source: require("../assets/images/Kevin.jpeg") },
  { name: "luca", source: require("../assets/images/Luca.jpeg") },
  { name: "max", source: require("../assets/images/Max.jpeg") },
];

type PostProps = {
  image: string;
};

const Post: React.FC<PostProps> = ({ image }) => (
  <Image source={{ uri: image }} style={styles.post} />
);

export type RootStackParamList = {
  FollowerList: { type: number };
  Authentification: undefined;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "FollowerList">;
};

const Profile: React.FC<Props> = ({ navigation }) => {
  const [userNotFound, setUserNotFound] = useState(false);
  const [notAuthorized, setNotAuthorized] = useState(false);
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [status, setStatus] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [followerCount, setFollowerCount] = useState("");
  const [followingCount, setFollowingCount] = useState("");
  const [postsCount, setPostsCount] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/users/:username",
        );
        setUsername(response.data.username);
        setNickname(response.data.nickname);
        setStatus(response.data.status);
        setProfilePicture(posts[2].source);
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
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Du musst dich erst anmelden</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => navigation.navigate("Authentification" as never)}
        >
          Anmelden
        </TouchableOpacity>
      </View>
    );
  } else if (userNotFound) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  } else
    return (
      <ScrollView style={styles.container}>
        <Image source={posts[2].source} style={styles.avatar} />

        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text style={styles.name}>{nickname}</Text>
            <Text
              style={{
                fontSize: SIZES.medium,
                color: COLORS.darkgray,
                marginBottom: "3%",
              }}
            >
              @{username}
            </Text>
            <Text style={{ marginBottom: 12, marginTop: 6 }}>{status}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => console.log("Test")}
            >
              <Text style={{ fontSize: SIZES.medium }}>Profil bearbeiten</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{postsCount}</Text>
              <Text>Beiträge</Text>
            </View>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => navigation.navigate("FollowerList", { type: 0 })}
            >
              <Text style={styles.statValue}>{followerCount}</Text>
              <Text>Follower</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => navigation.navigate("FollowerList", { type: 1 })}
            >
              <Text style={styles.statValue}>{followingCount}</Text>
              <Text>Gefolgt</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => navigation.navigate("FollowerList", { type: 2 })}
            >
              <Text style={styles.statValue}>2</Text>
              <Text>Anfragen</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text
          style={{
            fontSize: SIZES.large,
            fontWeight: "bold",
            marginTop: "5%",
            marginLeft: "4%",
            marginBottom: "1%",
          }}
        >
          Beiträge
        </Text>
        <View style={styles.posts}>
          {posts.map((image, index) => (
            <Post key={index} image={image.source} />
          ))}
        </View>
      </ScrollView>
    );
};
export default Profile;

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  avatar: {
    width: "100%",
    height: "30%",
  },

  userInfo: {
    alignItems: "center",
  },
  name: {
    fontWeight: "bold",
    fontSize: 28,
    marginBottom: "1%",
  },
  editButton: {
    marginVertical: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    ...SHADOWS.medium,
  },
  errorText: {
    fontSize: SIZES.large,
  },
  errorButton: {
    marginVertical: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  statItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  statValue: {
    fontWeight: "bold",
    fontSize: SIZES.medium,
  },
  posts: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: "7%",
  },
  post: {
    width: "46%",
    aspectRatio: 1,
    borderRadius: 18,
    marginVertical: "3%",
  },
});
