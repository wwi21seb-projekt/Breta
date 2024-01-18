import UserList from "../components/UserList";
import { useRoute } from "@react-navigation/native";

interface RouteParams {
  type: number;
  users: any
}

const FollowerListScreen = () => {
  const route = useRoute();
  const params = route.params as RouteParams;
  const type = params.type ? params.type : 0;
  const users = params.users ? params.users : 0;
    return (
      <UserList type={type} users={users}/>
    );
  }

export default FollowerListScreen;