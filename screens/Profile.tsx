import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SHADOWS } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";

const posts = [
  { name: 'kevin', source: require('../assets/images/Kevin.jpeg') },
  { name: 'luca', source: require('../assets/images/Luca.jpeg') },
  { name: 'max', source: require('../assets/images/Max.jpeg') },
];

type PostProps = {
  image: string;
};

const Post: React.FC<PostProps> = ({ image }) => (
  <Image source={{uri: image}} style={styles.post}/>
);


const Profile = () => {


  const navigation = useNavigation();


    return (
      <ScrollView style={styles.container}>
  
  <Image
    source={posts[2].source}
    style={styles.avatar}
  />

        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text style={styles.name}>DübelDoc</Text>
            <Text style={{fontSize: SIZES.medium, color: COLORS.darkgray, marginBottom: '3%'}}>@nico01</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={()=> console.log("Test")}
            >
              <Text style={{fontSize: SIZES.medium}}>Profil bearbeiten</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.stats}>
          <View style={styles.statItem}>
              <Text style={styles.statValue}>{posts.length}</Text>
              <Text>Beiträge</Text>
            </View>
            <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate("FollowerList" as never)}>
              <Text style={styles.statValue}>8</Text>
              <Text>Follower</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate("FollowedList" as never)}>
              <Text style={styles.statValue}>7</Text>
              <Text>Gefolgt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate("FriendRequest" as never)}>
              <Text style={styles.statValue}>1</Text>
              <Text>Anfragen</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={{fontSize: SIZES.large, fontWeight: 'bold', marginTop: '5%', marginLeft: '4%', marginBottom: '1%'}}>
            Beiträge
          </Text>
        <View style={styles.posts}>
          {posts.map((image, index) => (
            <Post key={index} image={image.source} />
          ))}
        </View>
      </ScrollView>
    );
}
export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  avatar: {
    width: '100%',
    height: '33%' 
  },
  
  
  
  userInfo: {
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 32,
    marginBottom: '1%'
  },
  editButton: {
    marginVertical: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    ...SHADOWS.medium
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: SIZES.medium,
  },
  posts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: '7%'},
  post: {
    width: '46%', 
    aspectRatio: 1, 
    borderRadius: 18,
    marginVertical: '3%'
  },
});
