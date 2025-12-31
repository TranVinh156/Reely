import { logout } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async (): Promise<void> => {
            return await logout();
        },
        onSuccess: () => {
            localStorage.removeItem('accessToken')
            navigate('/')
            window.location.reload()
        }
    });
};

export default useLogout