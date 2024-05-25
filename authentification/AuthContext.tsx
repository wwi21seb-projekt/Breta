import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorComp from "../components/ErrorComp";
import { baseUrl } from "../env";
import { navigate, reset } from "../navigation/NavigationService";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import { registerForPushNotificationsAsync } from "../screens/NotificationScreen";

interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  user: string | null;
  loading: boolean;
  login: (
    username: string,
    password: string,
    setServerError: Dispatch<SetStateAction<string>>,
    setErrorTextUsername: Dispatch<SetStateAction<string>>,
    setErrorTextLogin: Dispatch<SetStateAction<string>>,
    setConfirmCodeText: Dispatch<SetStateAction<string>>,
  ) => Promise<void>;
  register: (
    username: string,
    password: string,
    nickname: string,
    email: string,
    setServerError: Dispatch<SetStateAction<string>>,
    setUsernameErrorText: Dispatch<SetStateAction<string>>,
    setEmailErrorText: Dispatch<SetStateAction<string>>,
  ) => Promise<void>;
  activateUser: (
    value: string,
    setIsConfirmed: Dispatch<SetStateAction<boolean>>,
    setAlreadyActivated: Dispatch<SetStateAction<boolean>>,
    setConfirmErrorText: Dispatch<SetStateAction<string>>,
    setServerError: Dispatch<SetStateAction<string>>,
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkTokenExpiry: (token: string, refreshToken: string) => Promise<boolean>;
}

const defaultContextValue: AuthContextType = {
  token: null,
  refreshToken: null,
  user: null,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  activateUser: async () => {},
  checkTokenExpiry: async () => {
    return false;
  },
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export function useAuth() {
  return useContext(AuthContext);
}

interface Props {
  children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);

  const isLoggedIn = async () => {
    let userToken: string | null = null;
    let userRefreshToken: string | null = null;
    let username: string | null = null;
    try {
      userToken = await AsyncStorage.getItem("token");
      userRefreshToken = await AsyncStorage.getItem("refreshToken");
      username = await AsyncStorage.getItem("user");
    } catch (error) {
      setErrorText("Restoring token failed.");
    }

    if (
      userToken !== null &&
      userRefreshToken !== null &&
      (await checkTokenExpiry(userToken, userRefreshToken))
    ) {
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("refreshToken");
      await AsyncStorage.removeItem("user");
    } else {
      setToken(userToken);
      setRefreshToken(userRefreshToken);
      setUser(username);
    }
  };

  const checkTokenExpiry = async (token: string, refreshToken: string) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp && currentTime >= decodedToken.exp) {
        const decodedRefreshToken = jwtDecode(refreshToken);
        if (decodedRefreshToken.exp && currentTime < decodedRefreshToken.exp) {
          let response;
          let data;
          try {
            response = await fetch(`${baseUrl}users/refresh`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                refreshToken: refreshToken,
              }),
            });
            data = await response.json();
            switch (response.status) {
              case 200:
                setToken(data.token);
                setRefreshToken(data.refreshToken);
                await AsyncStorage.setItem("token", data.token);
                await AsyncStorage.setItem("refreshToken", data.refreshToken);
                return false;
              case 401:
                return true;
              case 404:
                return true;
              default:
                return true;
            }
          } catch (error) {
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      return true;
    }
  };

  async function registerDeviceForNotifications(authToken: any) {
    let tokenError;
    let registerTokenError;
    let deviceToken: string = '';
    try{
      deviceToken = await registerForPushNotificationsAsync() ?? '';
    }catch (error){
      tokenError = error
    }
    if(!tokenError){
      let response;
      let data;
      try{
        console.log("deviceToken to Backend: " + deviceToken)
        response = await fetch(`${baseUrl}push/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            type: "expo",
            token: deviceToken,
          }),
        });
        data = await response.json();
        console.log(response.status)
        switch (response.status) {
          case 201:
            console.log("Device successfully registered for Notifacations! PushToken: ", deviceToken)
            break;
          case 401: 
            registerTokenError = "401 Error: " + data.error.title + "\nMessage: " + data.error.message
            break;
          case 400:
            registerTokenError = "400 Error: " + data.error.title + "\nMessage: " + data.error.message
            break;
          }
      }catch (error){
        console.log(error)
      }
      if(registerTokenError){
        console.log(registerTokenError)
      }
    }else{
      console.log(tokenError)
    }
  }

  const authContext: AuthContextType = {
    login: async (
      username,
      password,
      setServerError,
      setErrorTextUsername,
      setErrorTextLogin,
      setConfirmCodeText,
    ) => {
      let response;
      let data;
      try {
        response = await fetch(`${baseUrl}users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });
        data = await response.json();
        switch (response.status) {
          case 200:
            setToken(data.token);
            setRefreshToken(data.refreshToken);
            setUser(username);
            await AsyncStorage.setItem("token", data.token);
            await AsyncStorage.setItem("refreshToken", data.refreshToken);
            await AsyncStorage.setItem("user", username);
            //register device to Navigationservice
            await registerDeviceForNotifications(data.token);
            navigate("Feed");
            break;
          case 401:
          case 404:
            setConfirmCodeText("");
            setErrorTextUsername("error");
            setErrorTextLogin(data.error.message);
            break;
          case 403:
            setErrorTextUsername("");
            setErrorTextLogin("");
            setConfirmCodeText(data.error.message);
            break;
          default:
            setServerError("Something went wrong, please try again later.");
        }
      } catch (error) {
        setServerError(
          "There are issues communicating with the server, please try again later.\n" + error,
        );
      }
    },
    register: async (
      username,
      password,
      nickname,
      email,
      setServerError,
      setUsernameErrorText,
      setEmailErrorText,
    ) => {
      let response;
      let data;
      try {
        response = await fetch(`${baseUrl}users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
            nickname: nickname,
            email: email,
          }),
        });
        data = await response.json();
        switch (response.status) {
          case 201:
            setUser(username);
            await AsyncStorage.setItem("user", username);
            navigate("ConfirmCode");
            break;
          case 400:
            setServerError(data.error.message);
            break;
          case 409:
            if (data.error.code === "ERR-002") {
              setEmailErrorText("");
              setUsernameErrorText(data.error.message);
            } else if (data.error.code === "ERR-003") {
              setUsernameErrorText("");
              setEmailErrorText(data.error.message);
            } else {
              setServerError("Something went wrong, please try again later.");
            }
            break;
          case 422: {
            setEmailErrorText(data.error.message);
            break;
          }
          default:
            setServerError("Something went wrong, please try again later.");
        }
      } catch (error) {
        setServerError(
          "There are issues communicating with the server, please try again later.",
        );
      }
    },
    activateUser: async (
      value,
      setIsConfirmed,
      setAlreadyActivated,
      setConfirmErrorText,
      setServerError,
    ) => {
      let response;
      let data;
      try {
        response = await fetch(`${baseUrl}users/${user}/activate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: value }),
        });
        data = await response.json();
        switch (response.status) {
          case 200:
            setIsConfirmed(true);
            break;
          case 208:
            setAlreadyActivated(true);
            break;
          case 401:
            setConfirmErrorText(data.error.message);
            break;
          case 404:
            setConfirmErrorText(data.error.message);
            break;
          default:
            setServerError("Something went wrong, please try again later.");
        }
      } catch (error) {
        setServerError(
          "There are issues communicating with the server, please try again later.",
        );
      }
    },
    logout: async () => {
      setLoading(true);
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("refreshToken");
      await AsyncStorage.removeItem("user");
      reset("Feed");
      setLoading(false);
    },
    token,
    refreshToken,
    user,
    loading,
    checkTokenExpiry,
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  if (errorText !== "") {
    return <ErrorComp errorText={errorText} />;
  } else {
    return (
      <AuthContext.Provider value={authContext}>
        {children}
      </AuthContext.Provider>
    );
  }
};
