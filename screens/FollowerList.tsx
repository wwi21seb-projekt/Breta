import { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SHADOWS, SIZES, COLORS } from "../constants/theme";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";

type User = {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  posts: string[];
  isFollowing: boolean;
};

interface RouteParams {
  type?: Number;
}

export type RootStackParamList = {
  FollowerProfile: { user: User };
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "FollowerProfile">;
};

const FollowerList: React.FC<Props> = ({ navigation }) => {
  const route = useRoute();

  const params = route.params as RouteParams;

  const type = params.type ? params.type : 0;

  const handleAccept = () => {
    console.log("Nutzer akzeptiert.");
  };

  const handleReject = () => {
    console.log("Nutzer abgelehnt.");
  };

  const initialUsers: User[] = [
    {
      id: "1",
      username: "top_G_3",
      nickname: "Aleks069",
      avatar: require("../assets/images/Max.jpeg"),
      posts: [
        require("../assets/images/Ei.jpeg"),
        require("../assets/images/Luca.jpeg"),
      ],
      isFollowing: true,
    },
    {
      id: "2",
      username: "koenig_kemal",
      nickname: "Kevin",
      avatar: require("../assets/images/Kevin.jpeg"),
      posts: [
        require("../assets/images/Adrian.jpeg"),
        require("../assets/images/Luca.jpeg"),
        require("../assets/images/Aleks.jpeg"),
      ],
      isFollowing: true,
    },
  ];

  const [users, setUsers] = useState<User[]>(initialUsers);

  const handleFollowPress = (id: string) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id ? { ...user, isFollowing: !user.isFollowing } : user,
      ),
    );
  };

  return (
    <ScrollView>
      <FlatList
        style={{ marginVertical: 10 }}
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("FollowerProfile", { user: item });
              }}
              style={styles.touchable}
            >
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <Text style={styles.name}>{item.username}</Text>
            </TouchableOpacity>
            {type === 2 ? (
              <>
                {" "}
                <TouchableOpacity
                  style={{ marginRight: "1%" }}
                  onPress={() => handleAccept()}
                >
                  <Ionicons
                    style={{ color: COLORS.green }}
                    size={SIZES.large}
                    name="checkmark-outline"
                  ></Ionicons>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleReject()}>
                  <Ionicons
                    style={{ color: COLORS.red }}
                    size={SIZES.large}
                    name="close-outline"
                  ></Ionicons>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleFollowPress(item.id)}
              >
                {/* hier muss Prüfung rein, ob schon gefolgt oder nicht */}
                <Text style={{ fontSize: SIZES.small }}>
                  {type === 0 && "Folgen"}
                  {type === 1 && "Entfolgen"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 7,
    marginHorizontal: 12,
    borderRadius: 18,
    ...SHADOWS.medium,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  name: {
    flex: 1,
    marginLeft: 10,
    fontSize: SIZES.medium,
  },
  button: {
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 18,
  },
  touchable: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
});

export default FollowerList;
