import React, { useState } from "react";
import { Icon } from "native-base";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { COLORS, SHADOWS, SIZES } from "../theme";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  Authentification: undefined;
  Feed: undefined;
};

type NavigationType = StackNavigationProp<
  RootStackParamList,
  "Authentification"
>;

const LoginPopup = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const navigation = useNavigation<NavigationType>();

  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(true);

      return () => {
        setModalVisible(false);
      };
    }, []),
  );

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      animationType="none"
      onRequestClose={() => {
        setModalVisible(false);
        navigation.navigate("Feed");
      }}
    >
      <View className="flex-1 items-center justify-center" style={{backgroundColor: "rgba(200, 200, 200, 0.8)"}}>
          <View className="bg-white rounded-xl p-4" style={{...SHADOWS.small}}>
            <TouchableOpacity onPress={() => navigation.navigate("Feed")}>
            <Icon
                as={Ionicons}
                name="arrow-back"
                size="xl"
                color={COLORS.black}
              />
            </TouchableOpacity>
            <View className="items-center py-2">
              <Text className="text-base mt-4 mb-6">
                To use this function, you have to be logged in.
              </Text>
              <TouchableOpacity
                className="bg-primary py-2 px-8 rounded-full"
                onPress={() => navigation.navigate("Authentification")}
              >
                <Text className="text-base">login</Text>
              </TouchableOpacity>
            </View>
          </View>
      </View>
    </Modal>
  );
};

export default LoginPopup;
