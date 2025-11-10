import { getFollowersCount } from "@/api/follow"
import { useQuery } from "@tanstack/react-query"

const useGetFollowersCount = (userId: number) => {
    return useQuery({
        queryKey: ['followersCount', userId],
        queryFn: () => getFollowersCount(userId),
        staleTime: 3 * 60 * 1000, // 5 minutes
    })
}

export default useGetFollowersCount
