// Follower.tsx
import { useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

type User = {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  posts: string[];
  isFollowing: boolean;
};

const FriendRequest = () => {

  const navigation = useNavigation();

    const initialUsers: User[] = [
      { id: '1', username: "koenig_kemal", nickname: 'Kevin', avatar: require('../assets/images/Kevin.jpeg'), posts: [require('../assets/images/Adrian.jpeg'), require('../assets/images/Luca.jpeg'), require('../assets/images/Aleks.jpeg')], isFollowing: true },
      ];

  const [users, setUsers] = useState<User[]>(initialUsers);

  const handleAccept = (id: string) => {
    console.log('Nutzer akzeptiert.')
    // setUsers((currentUsers) =>
    //   currentUsers.map((user) =>
    //     user.id === id ? { ...user, isFollowing: !user.isFollowing } : user
    //   )
    // );
  };

  const handleReject = (id: string) => {
    console.log('Nutzer abgelehnt.')
    // setUsers((currentUsers) =>
    //   currentUsers.map((user) =>
    //     user.id === id ? { ...user, isFollowing: !user.isFollowing } : user
    //   )
    // );
  };


  return (
    <ScrollView>
    <FlatList
    style={{marginVertical:10}}
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <TouchableOpacity onPress={() => {navigation.navigate("FollowerProfile", { user: item });}} style={styles.touchable}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{item.username}</Text>
          </TouchableOpacity>
          <TouchableOpacity
          style={{marginRight: '1%'}}
            onPress={() => handleAccept(item.id)}
          >
            <Ionicons style={{color: COLORS.green}} size={SIZES.large} name="checkmark-outline"></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleReject(item.id)}
          >
            <Ionicons style={{color: COLORS.red}} size={SIZES.large} name="close-outline"></Ionicons>
          </TouchableOpacity>
        </View>
      )}
    />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 7,
    marginHorizontal: 12,
    borderRadius: 18,
    ...SHADOWS.medium
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  name: {
    flex: 1,
    marginLeft: 10,
    fontSize: SIZES.medium
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, 
  },
  
});

export default FriendRequest;
