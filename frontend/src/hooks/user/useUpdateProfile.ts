import { updateUserProfile } from "@/api/user"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const useUpdateProfile = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateUserProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] })
        },
    })
}

export default useUpdateProfile
