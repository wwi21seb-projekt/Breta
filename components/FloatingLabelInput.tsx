import { useEffect, useRef, useState } from "react";
import { COLORS } from "../theme";
import {
  Text,
  TextInput,
  View,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from "react-native";

type Props = React.ComponentProps<typeof TextInput> & {
  label: string;
  errorText?: string | null;
  noErrorText?: boolean;
  onChangeText: (text: string) => void;
  value: string;
};

const FloatingLabelInput: React.FC<Props> = (props) => {
  const {
    label,
    errorText,
    noErrorText,
    onChangeText,
    value,
    onBlur,
    onFocus,
    ...restOfProps
  } = props;
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const focusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused || !!value ? 1 : 0,
      duration: 150,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [focusAnim, isFocused, value]);

  let color = isFocused ? COLORS.primary : COLORS.lightgray;
  if (errorText) {
    color = COLORS.red;
  }

  return (
    <View className="my-2">
      <TextInput
        className="border pb-4 pt-2 px-4 rounded-xl text-base"
        style={[
          {
            borderColor: color,
          },
        ]}
        ref={inputRef}
        {...restOfProps}
        value={value}
        onChangeText={onChangeText}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
      />
      <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
        <Animated.View
          className="absolute bg-white px-2"
          style={[
            {
              transform: [
                {
                  scale: focusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.75],
                  }),
                },
                {
                  translateY: focusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [11, -16],
                  }),
                },
                {
                  translateX: focusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text
            className="text-base"
            style={[
              {
                color,
              },
            ]}
          >
            {label}
            {errorText ? "*" : ""}
          </Text>
        </Animated.View>
      </TouchableWithoutFeedback>
      {!!errorText && !noErrorText && (
        <Text className="text-sm text-red my-1 mx-2">{errorText}</Text>
      )}
    </View>
  );
};

export default FloatingLabelInput;
