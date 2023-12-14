const COLORS = {
  primary: "#00CED1",
  secondary: "#E7F7E9",

  lightgray: "#d3d3d3",
  darkgray: "#A9A9A9",

  white: "#FFFFFF",
  black: "#000000",

  green: "#4CD964",
  red: "#FF2D55",
  blue: "#080F9C",
};

const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

export { COLORS, SIZES, SHADOWS };
