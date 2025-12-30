import { useMutation } from "@tanstack/react-query";
import { register } from "../../api/auth";
import type { User } from "../../types/user";
import { useNavigate } from "react-router";

export interface RegisterCredentials {
    email: string
    username: string
    password: string
    age: number
}

const useRegister = () => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async (credentials: RegisterCredentials): Promise<User> => {
            return await register(credentials);
        },
        onSuccess: () => {
            navigate('/login')
        }
    });
};

export default useRegister;
