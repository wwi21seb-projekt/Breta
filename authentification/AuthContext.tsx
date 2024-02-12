import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorComp from "../components/ErrorComp";

interface AuthContextType {
  token: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const defaultContextValue: AuthContextType = {
  token: null,
  login: async () => {},
  logout: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken: string | null = null;
      try {
        userToken = await AsyncStorage.getItem("userToken");
      } catch (error) {
        setErrorText("Restoring token failed.");
      }
      setToken(userToken);
      setLoading(false);
    };

    bootstrapAsync();
  }, []);

  const authContext: AuthContextType = {
    login: async () => {
      setToken("tedauba");
      await AsyncStorage.setItem("userToken", "tedauba");
    },
    logout: async () => {
      setToken(null);
      await AsyncStorage.removeItem("userToken");
    },
    token,
  };

  if (errorText !== "") {
    return <ErrorComp errorText={errorText} />;
  } else {
    return (
      <AuthContext.Provider value={authContext}>
        {!loading && children}
      </AuthContext.Provider>
    );
  }
};
