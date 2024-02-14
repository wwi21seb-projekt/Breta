import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorComp from "../components/ErrorComp";
import { baseUrl } from "../env";
import { navigate } from '../navigation/NavigationService';


interface AuthContextType {
  token: string | null,
  refreshToken: string | null;
  user: string,
  login: (username: string, password: string, setServerError: Dispatch<SetStateAction<string>>, setErrorTextUsername: Dispatch<SetStateAction<string>>, setErrorTextLogin: Dispatch<SetStateAction<string>>, setConfirmCodeText: Dispatch<SetStateAction<string>>) => Promise<void>;
  register: (username: string, password: string, nickname: string, email: string, setServerError: Dispatch<SetStateAction<string>>, setUsernameErrorText: Dispatch<SetStateAction<string>>, setEmailErrorText: Dispatch<SetStateAction<string>>) => Promise<void>;
  activateUser: (value: string, setIsConfirmed: Dispatch<SetStateAction<boolean>>, setAlreadyActivated: Dispatch<SetStateAction<boolean>>, setConfirmErrorText: Dispatch<SetStateAction<string>>, setServerError: Dispatch<SetStateAction<string>>) => Promise<void>;
  logout: () => Promise<void>; 
}

const defaultContextValue: AuthContextType = {
  token: null,
  refreshToken: null,
  user: "",
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  activateUser: async () => {},
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
  const [user, setUser] = useState("");
  const [errorText, setErrorText] = useState("");

  const isLoggedIn = async () => {
    let userToken: string | null = null;
    let username: string | null = null;
    try {
      userToken = await AsyncStorage.getItem("token");
      username = await AsyncStorage.getItem("user");
    } catch (error) {
      setErrorText("Restoring token failed.");
    }
    setToken(userToken);
    if(username !== null)
    {
      setUser(username);
    } else {
    setUser("");
  }
  };


  const authContext: AuthContextType = {
    login: async (username, password, setServerError, setErrorTextUsername, setErrorTextLogin, setConfirmCodeText) => {
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
            await AsyncStorage.setItem("user", user);
            navigate("Feed");
            break;
          case 401:
            setErrorTextUsername("error");
            setErrorTextLogin(data.error.message);
            break;
          case 403:
            setConfirmCodeText(data.error.message);
            break;
          case 404:
            setErrorTextUsername("error");
            setErrorTextLogin(data.error.message);
            break;
          default:
            setServerError("Something went wrong. Please try again.");
        }
      } catch (error) {
        setServerError("Connection error. Please try again.");
      }
    },
    register: async (username, password, nickname, email, setServerError, setUsernameErrorText, setEmailErrorText) => {
      let response;
      let data;
    try {
      response = await fetch(`${baseUrl}users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, nickname, email}),
      });
      data = await response.json();
      switch (response.status) {
        case 201:
          setUser(username);
          await AsyncStorage.setItem("user", user);
          navigate("ConfirmCode");
          break;
        case 400:
          setServerError(data.error.message);
          break;
        case 409:
          if (data.error.code === "ERR-002") {
            setUsernameErrorText(data.error.message);
          } else if (data.error.code === "ERR-003") {
            setEmailErrorText(data.error.message);
          } else {
            setServerError("Something went wrong. Please try again.");
          }
          break;
        case 422: {
          setEmailErrorText(data.error.message);
          break;
        }
        default:
          setServerError("Something went wrong. Please try again.");
      }
    } catch (error) {
      setServerError("Connection error. Please try again.");
    } 
    },
    activateUser: async (value, setIsConfirmed, setAlreadyActivated, setConfirmErrorText, setServerError) => {
      let response;
      let data;
      console.log(user);
      try {
      response = await fetch(`${baseUrl}users/${user}/activate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // token: value
        body: JSON.stringify({ value }),
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
          setServerError("Something went wrong. Please try again.");
      }
    } catch (error) {
      setServerError("Connection error. Please try again.");
    }
    },
    logout: async () => {
      setToken(null);
      await AsyncStorage.removeItem("token");
    },
    token,
    refreshToken,
    user
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
