import UserProfile from "../components/UserProfile";
import {dummyData} from "../DummyData";


const GeneralProfileScreen = () => {
    return (
      <UserProfile personal={false} user={dummyData[0]}/>
    );
  }

export default GeneralProfileScreen;