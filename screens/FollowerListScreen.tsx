import UserList from "../components/UserListItem";
import { View, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import { dummyData } from "../DummyData";

interface RouteParams {
  type: string;
  users: any;
}


const FollowerListScreen = () => {
  const route = useRoute();
  const params = route.params as RouteParams;
  const type = params.type ? params.type : "";
  return (
    <View className="bg-white h-full">
      <FlatList
        className="my-6"
        data={dummyData}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <UserList type={type} user={item} />
        )}
      />
    </View>
  )
};

export default FollowerListScreen;
