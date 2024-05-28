import { Text, View } from "react-native";
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
  } from "react-native-confirmation-code-field";
  import { Dispatch, SetStateAction } from "react";
  import { COLORS } from "../theme";

  type Props = {
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
  };

const ConfirmationCodeField: React.FC<Props> = ({
    value,
    setValue
  }) => {
    
  const CELL_COUNT = 6;
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <CodeField
    ref={ref}
    {...props}
    value={value}
    onChangeText={setValue}
    cellCount={CELL_COUNT}
    keyboardType="number-pad"
    textContentType="oneTimeCode"
    renderCell={({ index, symbol, isFocused }) => (
      <View
        key={index}
        style={{
          borderColor: isFocused ? COLORS.primary : COLORS.lightgray,
        }}
        className="w-10 h-10 border-2 rounded justify-center"
        onLayout={getCellOnLayoutHandler(index)}
      >
        <Text className="text-base text-center">
          {symbol || (isFocused ? <Cursor /> : null)}
        </Text>
      </View>
    )}
  />
  );
};

export default ConfirmationCodeField;
