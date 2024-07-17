import React, { useState, Dispatch, SetStateAction } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { COLORS, SHADOWS } from "../theme";
import { useFocusEffect } from "@react-navigation/native";
import { navigate } from "../navigation/NavigationService";

type Props = {
  setIsLoginPopupVisible?: Dispatch<SetStateAction<boolean>>
};

const LoginPopup: React.FC<Props> = (props) => {
    const {
      setIsLoginPopupVisible
    } = props;
 
  const [modalVisible, setModalVisible] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(true);

      return () => {
        setModalVisible(false);
      };
    }, []),
  );

  const closeModel = () => {
    setModalVisible(false); 
    navigate("Feed"); 
    if (setIsLoginPopupVisible !== undefined) {
      setIsLoginPopupVisible(false);
    }
  };

  return (
    <Modal transparent={true} visible={modalVisible} animationType="none">
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: "rgba(200, 200, 200, 0.8)" }}
      >
        <View className="bg-white rounded-xl p-4" style={{ ...SHADOWS.small }}>
        <TouchableOpacity onPress={() => {closeModel()}}>
            <Ionicons name="arrow-back" size={26} color={COLORS.black} />
          </TouchableOpacity>
          <View className="items-center py-2">
            <Text className="text-base mt-4 mb-6">
              To use this function, you have to be logged in.
            </Text>
            <TouchableOpacity
              className="bg-primary py-2 px-8 rounded-full"
              onPress={() => navigate("Authentification")}
            >
              <Text className="text-base">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LoginPopup;
