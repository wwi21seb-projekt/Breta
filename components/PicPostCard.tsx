import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  username: string;
  profilePic: string;
  date: string;
  initialLikes?: number;
  imageUri: string;
  caption: string;
  style?: React.CSSProperties;
}

const PicPostCard: React.FC<Props> = (props) => {
  const {
    username,
    profilePic,
    date,
    initialLikes = 132,
    imageUri,
    caption,
    style,
  } = props;
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  // Funktion zum Handhaben des Like-Button-Drucks
  const handleLikePress = () => {
    const newLikes = isLiked ? Math.max(likes - 1, 0) : likes + 1;
    setLikes(newLikes);
    setIsLiked(!isLiked);
  };

  return (
    <View style={[styles.card]}>
      <View style={styles.header}>
        <Image source={{ uri: profilePic }} style={styles.profilePic} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <TouchableOpacity style={styles.likes} onPress={handleLikePress}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={24}
            color={isLiked ? "red" : "black"}
          />
          <Text style={styles.likesText}>{likes}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bodyCard}>
        <Image source={{ uri: imageUri }} style={styles.postImage} />
        <Text style={styles.caption}>{caption}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,

    overflow: "hidden", // Stellt sicher, dass das Bild nicht über die Rundungen des Headers hinausgeht
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginHorizontal: 10, // Erweitert den Header horizontal um jeweils 10
    backgroundColor: "#fff",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 20,
    zIndex: 1, // Stellt sicher, dass der Header über dem Body liegt
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "grey",
  },
  likes: {
    flexDirection: "row",
    alignItems: "center",
  },
  likesText: {
    marginLeft: 4,
  },
  bodyCard: {
    backgroundColor: "white",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,

    marginTop: -5, // Negativer Margin, um den Body näher an den Header zu schieben
    marginHorizontal: "3.5%", // Zentriert den Body und macht ihn schmaler als den Header

    elevation: 4,
  },
  postImage: {
    width: "100%", // Breite so setzen, dass sie geringfügig schmaler als der Header ist
    height: 200, // oder die Höhe, die Sie wünschen
    marginTop: -10, // Hebt das Bild nach oben, um es mit dem Header zu überlappen
  },
  caption: {
    fontSize: 16,
    color: "black",
    padding: 15,
  },
});

export default PicPostCard;
