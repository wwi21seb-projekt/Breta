import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";

export const useCheckAuthentication = () => {
  const { token, refreshToken, checkTokenExpiry } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const validateToken = async () => {
    if (!token || !refreshToken) {
      setIsAuthenticated(false);
    } else {
      const isTokenExpired = await checkTokenExpiry(token, refreshToken);
      setIsAuthenticated(!isTokenExpired);
    }
  };

  useEffect(() => {
    validateToken();
  }, [token, refreshToken, checkTokenExpiry]);

  return isAuthenticated;
};
