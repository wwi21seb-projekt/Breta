import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Follower from "../components/Follower";
import FriendRequest from "../components/FriendRequest";


export default function Search() {
  return (
    // <Follower isFollower={false}/>
    <FriendRequest/>
  );
}
