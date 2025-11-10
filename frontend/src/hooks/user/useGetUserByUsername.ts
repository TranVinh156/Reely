import { getUserByUsername } from "@/api/user"
import { useQuery } from "@tanstack/react-query"

const useGetUserByUsername = (username: string) => {
    return useQuery({
        queryKey: ["user", username],
        queryFn: () => getUserByUsername(username),
        staleTime: 3 * 60 * 1000,
        retry: false
    })
}

export default useGetUserByUsername