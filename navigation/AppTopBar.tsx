import { IconButton, Icon, HStack, Text } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useNavigation, useRoute } from "@react-navigation/native";
import { SIZES } from "../constants/theme";

type RootStackParamList = {
  Home: undefined;
  Impressum: undefined;
};

type AppTopBarProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const AppTopBar: React.FC<AppTopBarProps> = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const canGoBack = navigation.canGoBack();

  let headerTitle;

  if (route.name === "Impressum") {
    headerTitle = (
      <Text fontSize={SIZES.large} fontWeight="bold">
        Impressum
      </Text>
    );
  } else if (route.name === "Authentification") {
    headerTitle = (
      <Text fontSize={SIZES.large} fontWeight="bold">
        Authentification
      </Text>
    );
  } else if (route.name === "FollowerList") {
    headerTitle = (
      <Text fontSize={SIZES.large} fontWeight="bold">
        Follower
      </Text>
    );
  } else if (route.name === "FollowedList") {
    headerTitle = (
      <Text fontSize={SIZES.large} fontWeight="bold">
        Gefolgt
      </Text>
    );
  } else if (route.name === "FriendRequest") {
    headerTitle = (
      <Text fontSize={SIZES.large} fontWeight="bold">
        Freundschaftsanfragen
      </Text>
    );
  } else if (route.name === "ConfirmCode") {
    headerTitle = (
      <Text fontSize={SIZES.large} fontWeight="bold">
        Login
      </Text>
    );
  } else {
    headerTitle = (
      <Text fontSize="20" fontWeight="bold">
        BRE<Text style={{ color: "aqua" }}>T</Text>A
      </Text>
    );
  }

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
          {headerTitle}
        </HStack>

        <HStack flex={1} justifyContent="flex-end">
          <IconButton
            icon={
              <Icon as={MaterialIcons} name="info" size="sm" color="black" />
            }
            onPress={() => navigation.navigate("Impressum" as never)}
          />
        </HStack>
      </HStack>
    </>
  );
};
export default AppTopBar;
