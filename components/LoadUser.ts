import { baseUrl } from "../env";
import { Dispatch, SetStateAction } from "react";
import { User } from "../components/types/User";


export const loadUser = async (username: string, setUser: Dispatch<SetStateAction<User | undefined>>, setError: Dispatch<SetStateAction<string>>) => {
  let data;
  const urlWithParams = `${baseUrl}users/:${username}`;
  let response;

  try {
    response = await fetch(urlWithParams, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      data = await response.json();
      setUser(data);
    } else {
      switch (response.status) {
        case 401:
          setError("Auf das Login Popup navigieren!");
          break;
        case 404:
          setError(
            "Dein Profil konnte nicht geladen werden. Versuche es später erneut.",
          );
          break;
        default:
          setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
      }
    }
  } catch (error) {
    setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
  }
};
