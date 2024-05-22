import { Dispatch, SetStateAction } from "react";

export const checkConfirmNewPassword = (
    confirmNewPassword: string,
    newPassword: string,
    setConfirmNewPasswordErrorText: Dispatch<SetStateAction<string>>
) => {
    if (confirmNewPassword.length === 0) {
      setConfirmNewPasswordErrorText("");
      return false;
    } else if (newPassword === confirmNewPassword) {
      setConfirmNewPasswordErrorText("");
      return true;
    } else {
      setConfirmNewPasswordErrorText("The passwords do not match.");
      return false;
    }
  };