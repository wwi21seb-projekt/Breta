import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SHADOWS } from "../constants/theme";

const images = {
  kevin: require('../assets/images/Kevin.jpeg'),
  luca: require('../assets/images/Luca.jpeg'),
  max: require('../assets/images/Max.jpeg'),
  // weitere Bilder...
};

type PostProps = {
  image: string;
};

const Post: React.FC<PostProps> = ({ image }) => (
  <Image source={{uri: image}} style={styles.post}/>
);

type ProfileState = {
  posts: string[];
};

export default class ProfileScreen extends React.Component<{}, ProfileState> {
  
  state: ProfileState = {
    posts: [
      images.kevin,
      images.luca,
      images.max,
      
    ],
  };

  // Dummy navigation functions
  navigateToFollowers = () => console.log('Navigate to Followers');
  navigateToFollowing = () => console.log('Navigate to Following');
  navigateToRequests = () => console.log('Navigate to Requests');
  navigateToEditProfile = () => console.log('Navigate to Edit Profile');



  render() {
    return (
      <ScrollView style={styles.container}>
  
  <Image
    source={{ uri: images.max }}
    style={styles.avatar}
  />

        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text style={styles.name}>DübelDoc</Text>
            <Text style={{fontSize: SIZES.medium, color: COLORS.darkgray, marginBottom: '3%'}}>@nico01</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={this.navigateToEditProfile}
            >
              <Text style={{fontSize: SIZES.medium}}>Profil bearbeiten</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.stats}>
          <View style={styles.statItem}>
              <Text style={styles.statValue}>{this.state.posts.length}</Text>
              <Text>Beiträge</Text>
            </View>
            <TouchableOpacity style={styles.statItem} onPress={this.navigateToFollowers}>
              <Text style={styles.statValue}>8</Text>
              <Text>Follower</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={this.navigateToFollowing}>
              <Text style={styles.statValue}>7</Text>
              <Text>Gefolgt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={this.navigateToRequests}>
              <Text style={styles.statValue}>1</Text>
              <Text>Anfragen</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={{fontSize: SIZES.large, fontWeight: 'bold', marginTop: '5%', marginLeft: '4%', marginBottom: '1%'}}>
            Beiträge
          </Text>
        <View style={styles.posts}>
          {this.state.posts.map((image, index) => (
            <Post key={index} image={image} />
          ))}
        </View>
      </ScrollView>
    );
  }
}

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
    height: '33%' // Ändern Sie dies auf 'auto'
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
