
import React from "react";
import { Text } from 'react-native';

interface Props {
  focused: any;
  title: string;
}

const TabBarText: React.FC<Props> = (props) => {
  return (
    <Text>
      {props.title}
    </Text>
  );
};

export default TabBarText;
