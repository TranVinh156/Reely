import { createContext, useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthState } from '../types/auth.state';
import type { User } from '../types/user';
import { getCurrentUser, logout as logoutApi, refreshToken } from '../api/auth';

interface AuthContextType extends AuthState {
    login: (accessToken: string, user: User) => void;
    logout: () => Promise<void>;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        token: "",
        user: null,
    });
    const [isLoading, setIsLoading] = useState(true);

    const initializeAuth = async () => {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            try {
                const response = await getCurrentUser();
                setAuthState({
                    isAuthenticated: true,
                    token: accessToken,
                    user: response,
                });
            } catch (error) {
                try {
                    const newAccessToken = await refreshToken();
                    localStorage.setItem('accessToken', newAccessToken);

                    const response: User = await getCurrentUser();
                    setAuthState({
                        isAuthenticated: true,
                        token: newAccessToken,
                        user: response,
                    });
                } catch (refreshError) {
                    localStorage.removeItem('accessToken');
                    setAuthState({
                        isAuthenticated: false,
                        token: "",
                        user: null,
                    });
                }
            }
        } else {
            setAuthState({
                isAuthenticated: false,
                token: "",
                user: null,
            });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        initializeAuth();
    }, []);

    const login = useCallback((accessToken: string, user: User) => {
        localStorage.setItem('accessToken', accessToken);
        console.log(accessToken, user);
        setAuthState({
            isAuthenticated: true,
            token: accessToken,
            user,
        });
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            localStorage.removeItem('accessToken');
            setAuthState({
                isAuthenticated: false,
                token: "",
                user: null,
            });
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                ...authState,
                login,
                logout,
                isAuthenticated: !!authState.token && !!authState.user,
                isLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
