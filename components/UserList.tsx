import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SHADOWS, COLORS } from "../theme";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { Icon } from "native-base";
import { useNavigation } from '@react-navigation/native';

type User = {
  id: string;
  username: string;
  nickname: string;
  avatarUrl: number;
  posts: number[];
  isFollowing: boolean;
};

type RootStackParamList = {
  GeneralProfile: { user: User };
};

type NavigationType = StackNavigationProp<RootStackParamList, 'GeneralProfile'>;

type Props = {
  type: number;
  users: User[];
};

const UserList: React.FC<Props> = ({type, users}) => {
  const navigation = useNavigation<NavigationType>();

  const handleAccept = () => {
    console.log("Nutzer akzeptiert.");
  };

  const handleReject = () => {
    console.log("Nutzer abgelehnt.");
  };

  const handleFollowPress = () => {
    console.log("Nutzer folgen oder entfolgen")
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
          style={{...SHADOWS.small}}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("GeneralProfile", { user: item });
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
                onPress={() => handleFollowPress()}
              >
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
