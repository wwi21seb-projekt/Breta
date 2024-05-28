import { View, Text } from "react-native";

type Props = {
  errorText: string;
};

const ErrorComp: React.FC<Props> = ({ errorText }) => {
  return (
    <View className="h-full bg-white items-center pt-64 px-6">
      <Text className="text-lg font-semibold mb-2">An error occured:</Text>
      <Text className="text-base">{errorText}</Text>
    </View>
  );
};

export default ErrorComp;
