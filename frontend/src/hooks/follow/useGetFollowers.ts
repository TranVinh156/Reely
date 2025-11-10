import { getFollowers } from "@/api/follow"
import { useQuery } from "@tanstack/react-query"

const useGetFollowers = (userId: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['followers', userId],
        queryFn: () => getFollowers(userId),
        staleTime: 5 * 60 * 1000,
        enabled: enabled && userId > 0
    })
}

export default useGetFollowers