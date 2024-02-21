import { baseUrl } from "../../env";
import { Dispatch, SetStateAction } from "react";

export const handleSubscription = async (
  token: string | null,
  isFollowed: boolean,
  setIsFollowed: Dispatch<SetStateAction<boolean>>,
  following: string,
  subscriptionId: string,
  setSubscriptionId: Dispatch<SetStateAction<string | null>>,
  setErrorText: Dispatch<SetStateAction<string>>,
) => {

  const makeRequest = async (url: string, options: RequestInit) => {
    let data;
    let response;
    try {
      response = await fetch(url, options);
      data = await response.json();
      if (response.ok) {
        setIsFollowed(!isFollowed);
        if (!isFollowed) {
          setSubscriptionId(data.subscriptionId);
        } else {
          setSubscriptionId(null);
        }
      } else {
        setErrorText(data.error.message);
      }
    } catch (error) {
      setErrorText("Something went wrong. Please try again.");
    }
  };

  const requestOptions: RequestInit = {
    method: isFollowed ? "DELETE" : "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
  };

  if (!isFollowed) {
    requestOptions.body = JSON.stringify({ following: following });
  }

  const url = isFollowed
    ? `${baseUrl}subscriptions/${subscriptionId}`
    : `${baseUrl}subscriptions`;

  await makeRequest(url, requestOptions);
};
