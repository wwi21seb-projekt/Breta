import { baseUrl } from "../env";
import { User } from "../components/types/User";
import { Dispatch, SetStateAction } from "react";

export const handleSubscription = async (isFollowed: boolean, setIsFollowed: Dispatch<SetStateAction<boolean>>, following: string, subscriptionId: string, setError: Dispatch<SetStateAction<string>>) => {
    let response;
    if (!isFollowed) {
      try {
        response = await fetch(`${baseUrl}subscriptions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            following,
          }),
        });

        if (response.ok) {
          setIsFollowed(true);
        } else {
          switch (response.status) {
            case 401:
              setError("Auf das Login Popup navigieren!");
              break;
            case 404:
              setError(
                "Der Nutzer, den du abbonieren möchtest, wurde nicht gefunden. Versuche es später erneut.",
              );
              break;
            case 406:
              setError("Du kannst dir nicht selbst folgen.");
              break;
            case 409:
              setError("Du folgst diesem Nutzer bereits.");
              break;
            default:
              setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
          }
        }
      } catch (error) {
        setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
      }
    } else {
      try {
        response = await fetch(
          `${baseUrl}subscriptions:${subscriptionId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (response.ok) {
          setIsFollowed(false);
        } else {
          switch (response.status) {
            case 401:
              setError("Auf das Login Popup navigieren!");
              break;
            case 403:
              setError("Du kannst nur deine eigenen Abbonements löschen.");
              break;
            case 404:
              setError(
                "Der Nutzer, den du deabbonieren möchtest, wurde nicht gefunden. Versuche es später erneut.",
              );
              break;
            default:
              setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
          }
        }
      } catch (error) {
        setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
      }
    }
  };