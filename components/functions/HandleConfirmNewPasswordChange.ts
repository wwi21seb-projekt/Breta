import { Dispatch, SetStateAction } from "react";

export const handleConfirmNewPasswordChange = (
    text: string,
    setConfirmNewPasswordErrorText: Dispatch<SetStateAction<string>>,
    setConfirmNewPassword: Dispatch<SetStateAction<string>>,
) => {
    setConfirmNewPasswordErrorText("");
    if (text.length <= 20) {
      setConfirmNewPassword(text);
    }
  };