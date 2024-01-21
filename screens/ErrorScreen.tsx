import { useRoute } from "@react-navigation/native";
import { Text, View } from "react-native";

type RouteParams = {
  error: string;
};

const ErrorScreen = () => {
  const route = useRoute();
  const params = route.params as RouteParams;
  const error = params.error;
  return (
    <View className="p-6 bg-white h-full">
      <Text className="text-base">{error}</Text>
    </View>
  );
};

export default ErrorScreen;
