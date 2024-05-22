import { Dispatch, SetStateAction } from "react";

export const checkNewPassword = (
    newPassword: string,
    setNewPasswordErrorText: Dispatch<SetStateAction<string>>
    ) => {
    if (newPassword.length === 0) {
      setNewPasswordErrorText("");
      return false;
    } else if (newPassword.length >= 8) {
      if (
        /[A-Z]/.test(newPassword) &&
        /[a-z]/.test(newPassword) &&
        /\d/.test(newPassword) &&
        /[`!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?~ ]/.test(newPassword)
      ) {
        setNewPasswordErrorText("");
        return true;
      } else {
        setNewPasswordErrorText(
          "The password must contain at least one lowercase letter, one uppercase letter, one number and one special character.",
        );
        return false;
      }
    } else {
      setNewPasswordErrorText(
        "The password must be at least 8 characters long.",
      );
      return false;
    }
  };