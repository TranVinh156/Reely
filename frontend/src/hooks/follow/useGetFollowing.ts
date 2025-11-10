import { getFollowing } from "@/api/follow"
import { useQuery } from "@tanstack/react-query"

const useGetFollowing = (userId: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['following', userId],
        queryFn: () => getFollowing(userId),
        staleTime: 3 * 60 * 1000, // 3 minutes
        enabled: enabled && userId > 0,
    })
}

export default useGetFollowing
