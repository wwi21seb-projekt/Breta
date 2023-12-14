import React from "react";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  focused: any;
  color: any;
  size?: number;
  style?: React.CSSProperties;
}

const TabBarIcon: React.FC<Props> = (props) => {
  const { icon, focused, size = 18, style } = props;

  return <Ionicons name={icon} size={size} color={focused} style={style} />;
};

export default TabBarIcon;
