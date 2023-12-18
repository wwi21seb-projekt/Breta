import { useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SHADOWS, SIZES } from '../constants/theme';

type User = {
  id: string;
  name: string;
  avatar: string;
  isFollowing: boolean;
};


const FollowerList = () => {


    const initialUsers: User[] = [
        // Beispiel-Daten - ersetze diese durch echte Daten
        { id: '1', name: 'Aleks069', avatar: require('../assets/images/Max.jpeg'), isFollowing: true },
        { id: '2', name: 'Kelly', avatar: require('../assets/images/Kevin.jpeg'), isFollowing: true },
        // Füge hier weitere Benutzer hinzu
      ];

  const [users, setUsers] = useState<User[]>(initialUsers);

  const handleFollowPress = (id: string) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id ? { ...user, isFollowing: !user.isFollowing } : user
      )
    );
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
            style={styles.button}
            onPress={() => handleFollowPress(item.id)}
          >
            {/* hier muss Prüfung rein, ob schon gefolgt oder nicht */}
            <Text style={{fontSize: SIZES.small}}>{item.isFollowing ? 'Entfolgen' : 'Folgen'}</Text>
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
  },
  button: {
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 18
  },
});

export default FollowerList;
