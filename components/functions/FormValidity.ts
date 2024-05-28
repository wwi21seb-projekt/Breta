import { checkNewPassword } from "./CheckNewPassword";
import { checkConfirmNewPassword } from "./CheckConfirmNewPassword";
import { Dispatch, SetStateAction } from "react";

export const updateFormValidity = (
    newPassword: string, 
    setNewPasswordErrorText: Dispatch<SetStateAction<string>>,
    confirmNewPassword: string,
    setConfirmNewPasswordErrorText: Dispatch<SetStateAction<string>>,
    setIsFormValid: Dispatch<SetStateAction<boolean>>
) => {
    const isValid = checkNewPassword(newPassword, setNewPasswordErrorText) && checkConfirmNewPassword(confirmNewPassword, newPassword, setConfirmNewPasswordErrorText);
    setIsFormValid(isValid);
  };