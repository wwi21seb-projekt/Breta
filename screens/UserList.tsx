import { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SHADOWS, COLORS } from "../theme";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { Icon } from "native-base";

type User = {
  id: string;
  username: string;
  nickname: string;
  avatarUrl: string;
  posts: string[];
  isFollowing: boolean;
};

interface RouteParams {
  type?: number;
}

export type RootStackParamList = {
  FollowerProfile: { user: User };
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "FollowerProfile">;
};

const UserList: React.FC<Props> = ({ navigation }) => {
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
      avatarUrl: require("../assets/images/Max.jpeg"),
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
      avatarUrl: require("../assets/images/Kevin.jpeg"),
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
    <ScrollView className="bg-white">
      <FlatList
        className="my-6"
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View 
          className="flex-row items-center rounded-3xl bg-white py-2 px-4 my-2 mx-6"
          style={{...SHADOWS.medium}}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("FollowerProfile", { user: item });
              }}
              className="flex-1 flex-row items-center"
            >
              <Image source={item.avatarUrl} 
              className="aspect-square rounded-full w-10" />
              <Text className="text-base ml-3">{item.username}</Text>
            </TouchableOpacity>
            {type === 2 ? (
              <>
                <TouchableOpacity
                  className="mr-2"
                  onPress={() => handleAccept()}
                >
                  <Icon as={Ionicons} name="checkmark-outline" size="md" color={COLORS.green} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleReject()}>
                <Icon as={Ionicons} name="close-outline" size="md" color={COLORS.red} />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
              className="py-1 px-2 rounded-3xl"
                style={{borderWidth: 1}}
                onPress={() => handleFollowPress(item.id)}
              >
                {/* hier muss Prüfung rein, ob schon gefolgt oder nicht */}
                <Text className="text-xs">
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

export default UserList;
