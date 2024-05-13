import { baseUrl } from "../../env";
import { Dispatch, SetStateAction } from "react";
import { User } from "../types/User";

export const loadUser = async (
  user: string,
  setUserInfo: Dispatch<SetStateAction<User | undefined>>,
  setErrorText: Dispatch<SetStateAction<string>>,
  token: string,
) => {
  let data;
  const urlWithParams = `${baseUrl}users/${user}`;
  let response;
  try {
    response = await fetch(urlWithParams, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    data = await response.json();
    switch (response.status) {
      case 200:
        setUserInfo(data);
        break;
      case 401:
        setErrorText(data.error.message);
        break;
      case 404:
        setErrorText(data.error.message);
        break;
      default:
        setErrorText("Something went wrong, please try again later.");
    }
  } catch (error) {
    setErrorText("There are issues communicating with the server, please try again later.");
  }
};
