import { StyleSheet } from "react-native";
import { COLORS, SHADOWS } from "../theme";

const styles = StyleSheet.create({

  textInput: {
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8
  },
  postButton: {
    backgroundColor: COLORS.primary,
    flex: 1,
    marginTop: 50,
    marginHorizontal: 120,
    padding: 12,
    alignItems: 'center',
    borderRadius: 18,
    ...SHADOWS.medium
  }
})

export default styles
