import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { SHADOWS, COLORS } from "../theme";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { Icon } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { ListUser } from "./types/UserListTypes";

// type RootStackParamList = {
//   GeneralProfile: { user: User };
// };

// type NavigationType = StackNavigationProp<RootStackParamList, "GeneralProfile">;

type Props = {
  type: string;
  user: ListUser;
};

const UserList: React.FC<Props> = ({ type, user }) => {
  // const navigation = useNavigation<NavigationType>();

  const handleAccept = () => {
    console.log("Nutzer akzeptiert.");
  };

  const handleReject = () => {
    console.log("Nutzer abgelehnt.");
  };

  const handleFollowPress = () => {
    console.log("Nutzer folgen oder entfolgen");
  };

  return (
    <View
            className="flex-row items-center rounded-3xl bg-white py-2 px-4 my-2 mx-6"
            style={{ ...SHADOWS.small }}
          >
            <TouchableOpacity
              onPress={() => {
                console.log("Auf User Profil navigieren")
                // navigation.navigate("GeneralProfile", { user: item });
              }}
              className="flex-1 flex-row items-center"
            >
              <Image
              source={require("../assets/images/Max.jpeg")}
                // source={user.profilePictureUrl} sobald Bilder da sind
                className="aspect-square rounded-full w-10"
              />
              <Text className="text-base ml-3">{user.username}</Text>
            </TouchableOpacity>
            {type === "request" ? (
              <>
                <TouchableOpacity
                  className="mr-2"
                  onPress={() => handleAccept()}
                >
                  <Icon
                    as={Ionicons}
                    name="checkmark-outline"
                    size="md"
                    color={COLORS.green}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleReject()}>
                  <Icon
                    as={Ionicons}
                    name="close-outline"
                    size="md"
                    color={COLORS.red}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                className="py-1 px-2 rounded-3xl"
                style={{ borderWidth: 1 }}
                onPress={() => handleFollowPress()}
              >
                <Text className="text-xs">
                  {type === "followers" && "Folgen"}
                  {type === "following" && "Entfolgen"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
  );
};

export default UserList;
