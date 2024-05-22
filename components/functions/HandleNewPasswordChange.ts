import { Dispatch, SetStateAction } from "react";

export const handleNewPasswordChange = (
    text: string,
    setNewPasswordErrorText: Dispatch<SetStateAction<string>>,
    setNewPassword: Dispatch<SetStateAction<string>>,
) => {
    setNewPasswordErrorText("");
    if (text.length <= 20) {
      setNewPassword(text);
    }
  };