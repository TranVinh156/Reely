import { changePassword } from "@/api/auth"
import { useMutation } from "@tanstack/react-query"

const useChangePassword = () => {
    return useMutation({
        mutationFn: changePassword,
    })
}

export default useChangePassword
