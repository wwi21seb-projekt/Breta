import { baseUrl } from "../../env";
import { Dispatch, SetStateAction } from "react";

export const handleSubscription = async (
  isFollowed: boolean,
  setIsFollowed: Dispatch<SetStateAction<boolean>>,
  following: string,
  subscriptionId: string,
  setSubscriptionId: Dispatch<SetStateAction<string>>,
  setError: Dispatch<SetStateAction<string>>,
) => {
  const handleErrorResponse = (status: number) => {
    const errorMessages: { [key: number]: string } = {
      401: "Auf das Login Popup navigieren!",
      403: "Du kannst nur deine eigenen Abbonements löschen.",
      404: `Der Nutzer, den du ${
        isFollowed ? "deabbonieren" : "abbonieren"
      } möchtest, wurde nicht gefunden. Versuche es später erneut.`,
      406: "Du kannst dir nicht selbst folgen.",
      409: "Du folgst diesem Nutzer bereits.",
    };

    setError(
      errorMessages[status] ||
        "Etwas ist schiefgelaufen. Versuche es später erneut.",
    );
  };

  const makeRequest = async (url: string, options: RequestInit) => {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        setIsFollowed(!isFollowed);
        if (!isFollowed) {
          const data = await response.json();
          setSubscriptionId(data.subscriptionId);
        } else {
          setSubscriptionId("");
        }
      } else {
        handleErrorResponse(response.status);
      }
    } catch (error) {
      setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
    }
  };

  const requestOptions: RequestInit = {
    method: isFollowed ? "DELETE" : "POST",
    headers: { "Content-Type": "application/json" },
  };

  if (!isFollowed) {
    requestOptions.body = JSON.stringify({ following });
  }

  const url = isFollowed
    ? `${baseUrl}subscriptions/${subscriptionId}`
    : `${baseUrl}subscriptions`;
  await makeRequest(url, requestOptions);
};
