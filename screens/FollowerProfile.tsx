import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { COLORS, SIZES, SHADOWS } from "../constants/theme";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

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

const FollowerProfile = () => {
  const route = useRoute();
  const user = route.params.user;

  return (
    <ScrollView style={styles.container}>
      <Image source={user.avatar} style={styles.avatar} />

      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.nickname}</Text>
          <Text
            style={{
              fontSize: SIZES.medium,
              color: COLORS.darkgray,
              marginBottom: "3%",
            }}
          >
            {user.username}
          </Text>
          <Text style={{ marginBottom: 12, marginTop: 6 }}>
            Hip Hip Hurra, mein Lumberjack ist da!
          </Text>
        </View>
        <View style={styles.buttonArea}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => console.log("entfolgen")}
          >
            <Text style={{ fontSize: SIZES.medium }}>entfolgen</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => console.log("chatten")}
          >
            <Text style={{ fontSize: SIZES.medium }}>chatten</Text>
            <Ionicons name="chatbubbles" style={{ marginLeft: 10 }} />
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
        {user.posts.map((url: any, index: any) => (
          <Image key={index} source={url} style={styles.post} />
        ))}
      </View>
    </ScrollView>
  );
};
export default FollowerProfile;

const styles = StyleSheet.create({
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
    height: "33%",
  },
  button: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 10,
    marginVertical: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    flexDirection: "row",
    ...SHADOWS.medium,
  },

  buttonArea: {
    flexDirection: "row",
    width: "90%",
    marginTop: 4,
  },

  userInfo: {
    alignItems: "center",
  },
  name: {
    fontWeight: "bold",
    fontSize: 28,
    marginBottom: "1%",
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
