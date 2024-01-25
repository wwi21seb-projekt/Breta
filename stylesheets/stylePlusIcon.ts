import { StyleSheet, Platform } from "react-native";

const stylePlusIcon = StyleSheet.create({
  addIcon: {
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    color: "black",
    marginBottom: 25,
    width: 55,
    height: 55,
    borderRadius: 50,
    shadowRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

export default stylePlusIcon;
