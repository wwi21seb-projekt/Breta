import { baseUrl } from "../../env";
import { Dispatch, SetStateAction } from "react";
import Chat from "../types/Chat";

export const loadChats = async (
    setChats: Dispatch<SetStateAction<Chat[]>>,
    setErrorText: Dispatch<SetStateAction<string>>,
    setAreNoChats: Dispatch<SetStateAction<boolean>>,
    token: string | null,
  ) => {
    let response;
    let data;
    try {
      response = await fetch(`${baseUrl}chats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    
      data = await response.json();
      switch (response.status) {
        case 200:
          if (data.records) {
            setChats(data.records);
          } else {
            setAreNoChats(true);
          }
          break;
        case 401:
          setErrorText(data.error.message);
          break;
        default:
          setErrorText("Something went wrong, please try again later.");
      }
    } catch (error) {
      setErrorText("There are issues communicating with the server, please try again later.");
    }
  };