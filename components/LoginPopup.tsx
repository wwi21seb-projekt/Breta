import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from "@react-navigation/stack";
import { COLORS, SHADOWS, SIZES } from '../theme';
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from '@react-navigation/native';

type RootStackParamList = {
    Authentification: undefined;
    Feed: undefined;
};

type NavigationType = StackNavigationProp<RootStackParamList, "Authentification">;

const LoginPopup = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const navigation = useNavigation<NavigationType>();

  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(true);
      
      return () => {
        setModalVisible(false);
      };
    }, [])
  );

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      animationType="none"
      onRequestClose={()=>{ setModalVisible(false); navigation.navigate("Feed"); }}
    >
      <View style={styles.overlayStyle}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={()=>navigation.navigate("Feed")}>
            <Ionicons name="arrow-back" size={SIZES.large} />
            </TouchableOpacity>
          <View style={styles.textView}>
            <Text style={styles.modalText}>Für diese Funktion musst du dich einloggen.</Text>
            <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("Authentification")}><Text>einloggen</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayStyle: {
    flex: 1,
    backgroundColor: 'rgba(200, 200, 200, 0.8)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textView: {
    paddingTop: 2,
    paddingBottom: 12,
    paddingHorizontal: 10, 
    alignItems: 'center',
  },
  button :{
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    ...SHADOWS.medium,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default LoginPopup;
