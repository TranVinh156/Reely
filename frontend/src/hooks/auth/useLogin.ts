import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/auth";
import type { User } from "../../types/user";
import { useAuth } from "./useAuth";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    user: User;
}

const useLogin = () => {
    const { login: authLogin } = useAuth();

    return useMutation({
        mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
            return await login(credentials.email, credentials.password);
        },
        onSuccess: (data: LoginResponse) => {
            authLogin(data.accessToken, data.user);
        },
        onError: (error: Error) => {
            localStorage.removeItem("accessToken");
            console.error("Login failed:", error);
        },
    });
};

export default useLogin;
