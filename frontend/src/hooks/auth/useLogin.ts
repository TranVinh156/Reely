import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/auth";

export interface LoginCredentials {
    email: string;
    password: string;
}

interface User {
    id: number;
    username: string;
    email: string;
    displayName: string;
    bio: string;
    avatarUrl: string;
    createdAt?: string;
    updatedAt?: string;
}

interface LoginResponse {
    accessToken: string;
    user: User;
}

const useLogin = () => {
    return useMutation({
        mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
            return await login(credentials.email, credentials.password);
        },
        onSuccess: (data: LoginResponse) => {
            localStorage.setItem("accessToken", data.accessToken);
        },
        onError: (error: Error) => {
            localStorage.removeItem("accessToken");
            console.error("Login failed:", error);
        },
    });
};

export default useLogin;
