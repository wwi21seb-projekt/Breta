import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


export default function Profile() {
  return (
    <View style={styles.container}>
      <Text>"Einmal ein Lumber Jack bitte" ~Kemal, 08-10.2023</Text>
      <StatusBar style="auto" />
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
