import * as React from "react";
import { IconButton, Icon, HStack, Text } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useNavigation, useRoute } from "@react-navigation/native";

type RootStackParamList = {
  Home: undefined;
  Impressum: undefined;
};

type AppBarProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const AppBar: React.FC<AppBarProps> = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const canGoBack = navigation.canGoBack();

  let headerTitle =
    route.name === "Impressum" ? (
      <Text fontSize="20" fontWeight="bold">
        Impressum
      </Text>
    ) : (
      <Text fontSize="20" fontWeight="bold">
        BRE<Text style={{ color: "aqua" }}>T</Text>A
      </Text>
    );

  return (
    <>
      <HStack px="1" py="3" alignItems="center" width="100%" shadow="9">
        <HStack flex={1} justifyContent="flex-start">
          {canGoBack && (
            <IconButton
              icon={
                <Icon
                  as={MaterialIcons}
                  name="arrow-back"
                  size="xl"
                  color="black"
                />
              }
              onPress={() => navigation.goBack()}
            />
          )}
        </HStack>

        <HStack flex={2} justifyContent="center">
          {/* <Text fontSize="20" fontWeight="bold">
            BRE<Text style={{ color: "aqua" }}>T</Text>A
            </Text> */}
          {headerTitle}
        </HStack>

        <HStack flex={1} justifyContent="flex-end">
          <IconButton
            icon={
              <Icon as={MaterialIcons} name="info" size="sm" color="black" />
            }
            onPress={() => navigation.navigate("Impressum")}
          />
        </HStack>
      </HStack>
    </>
  );
};
export default AppBar;
