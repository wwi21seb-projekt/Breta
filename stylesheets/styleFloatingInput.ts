import { StyleSheet } from "react-native";

import { COLORS, SIZES, SHADOWS } from "../theme";

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingLabelContainer: {
    position: "absolute",
    paddingHorizontal: 8,
    backgroundColor: COLORS.white,
    marginLeft: 40,
  },
  input: {
    padding: 18,
    borderWidth: 1,
    borderRadius: 18,
    fontSize: SIZES.medium,
    marginHorizontal: 40,
  },
  label: {
    fontSize: SIZES.medium,
  },
  buttonSwitch: {
    backgroundColor: COLORS.primary,
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 18,
    ...SHADOWS.medium,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 18,
    ...SHADOWS.medium,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    flex: 1,
    marginTop: 180,
    marginHorizontal: 120,
    padding: 12,
    alignItems: "center",
    borderRadius: 18,
    ...SHADOWS.medium,
  },
  error: {
    marginLeft: 60,
    fontSize: SIZES.small,
    color: COLORS.red,
    marginBottom: 30,
  },
});

export default styles;
