import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

import TextPostCard from "../components/TextPostCard";
import PicPostCard from "../components/PicPostCard";
import { ScrollView } from "react-native";


interface PostProps {
  username: string;
  profilePic: string;
  date: string;
  likes: number;
  focused: boolean;
  content: string;
  postContent: string;
  // Add more props as needed, such as comments or share functionality
}

const FeedScreen: React.FC<PostProps> = (props) => {
  const { username = "Justin", profilePic, date ="18.12.2023", likes = 100, focused = false, postContent ="Mein Erster Post und weil die faxen machen die chinesen machen faxen deswegen töten die italienr die" } = props;
  const picPostProps = {
    username: "Aleks069",
    profilePic: require('../assets/images/test.jpg'),
    date: "02.12.2023",
    initialLikes: 132,
    imageUri: require('../assets/images/test.jpg'),
    caption: "Ludwigshafen ist und bleibt einfach mein Lieblingsrei..."
  };
  return (
    <ScrollView style={styles.postContainer}>
      <TextPostCard
        username={username}
        profilePic={require('../assets/images/test.jpg')}
        date={date}
        likes={likes}
        focused={focused} 
        postContent= {postContent}
        />

    <PicPostCard
        username={picPostProps.username}
        profilePic={picPostProps.profilePic}
        date={picPostProps.date}
        initialLikes={picPostProps.initialLikes}
        imageUri={picPostProps.imageUri}
        caption={picPostProps.caption}
      />
      <PicPostCard
        username={picPostProps.username}
        profilePic={picPostProps.profilePic}
        date={picPostProps.date}
        initialLikes={picPostProps.initialLikes}
        imageUri={picPostProps.imageUri}
        caption={picPostProps.caption}
      /><PicPostCard
      username={picPostProps.username}
      profilePic={picPostProps.profilePic}
      date={picPostProps.date}
      initialLikes={picPostProps.initialLikes}
      imageUri={picPostProps.imageUri}
      caption={picPostProps.caption}
    />

      <TextPostCard
        username={username}
        profilePic={require('../assets/images/test.jpg')}
        date={date}
        likes={likes}
        focused={focused} 
        postContent= {postContent}
        />
     
      {/* You can add more elements here such as a comments section or share button */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 10,
  },
  postContent: {
    marginTop: 10,
    fontSize: 16,
  },
  // Add more styles for comments section, share button, etc.
});
export default FeedScreen;

// type RootStackParamList = {
//   Auth: undefined;
// };

// type FeedScreenProps = {
//   navigation: StackNavigationProp<RootStackParamList, "Auth">;
// };

// const FeedScreen: React.FC<FeedScreenProps> = ({ navigation }) => {
//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text style={{ marginBottom: 30 }}>Das ist die Feed Seite</Text>
//       <TouchableOpacity
//         style={{
//           backgroundColor: COLORS.primary,
//           padding: 12,
//           borderRadius: 18,
//           ...SHADOWS.medium,
//         }}
//         onPress={() => navigation.navigate("Auth" as never)}
//       >
//         <Text style={{ color: COLORS.black, fontSize: SIZES.large }}>
//           Registrierung / Login
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };
