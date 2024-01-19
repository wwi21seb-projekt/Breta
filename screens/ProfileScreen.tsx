import UserProfile from "../components/UserProfile";
import { dummyData } from "../DummyData";

const ProfileScreen = () => {
  return <UserProfile personal={true} user={dummyData[0]} />;
};

export default ProfileScreen;
