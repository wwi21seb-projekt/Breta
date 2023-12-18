// Follower.tsx
import { useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';
import { Ionicons } from "@expo/vector-icons";

type User = {
  id: string;
  name: string;
  avatar: string;
  isFollowing: boolean;
};


const FriendRequest = () => {


    const initialUsers: User[] = [
        // Beispiel-Daten - ersetze diese durch echte Daten
        { id: '1', name: 'Aleks069', avatar: require('../assets/images/Max.jpeg'), isFollowing: true },
        { id: '2', name: 'Kelly', avatar: require('../assets/images/Kevin.jpeg'), isFollowing: true},
        // Füge hier weitere Benutzer hinzu
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
    <FlatList
    style={{marginVertical:10}}
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{item.name}</Text>
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
  }
});

export default FriendRequest;
