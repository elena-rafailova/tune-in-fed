import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState();
    const [tokenExpDate, setTokenExpDate] = useState();
    const [userId, setUserId] = useState(false);
    const [user, setUser] = useState({});

    const login = useCallback((uid, token, user, expirationDate) => {
        setToken(token);
        setUserId(uid);
        setUser(user);
        const tokenExpirationDate =
            expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpDate(tokenExpirationDate);
        localStorage.setItem(
            'userData',
            JSON.stringify({
                userId: uid,
                token: token,
                expiration: tokenExpirationDate.toISOString(),
                user: user,
            })
        );
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setTokenExpDate(null);
        setUserId(null);
        setUser({});
        localStorage.removeItem('userData');
        window.location.replace('/');
    }, []);

    useEffect(() => {
        if (token && tokenExpDate) {
            const remainingTime = tokenExpDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpDate]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()
        ) {
            login(
                storedData.userId,
                storedData.token,
                storedData.user,
                new Date(storedData.expiration)
            );
        }
    }, [login]);

    return { token, login, logout, userId, user };
};
