import { useAuth } from "./AuthContext";
import { useState, useEffect } from 'react';

export const checkAuthentification = () => {
    const { token } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    useEffect(() => {
        setIsAuthenticated(!!token);
    }, [token]);

    return isAuthenticated;
};
