import { getFollowingCount } from "@/api/follow"
import { useQuery } from "@tanstack/react-query"

const useGetFollowingCount = (userId: number) => {
    return useQuery({
        queryKey: ['followingCount', userId],
        queryFn: () => getFollowingCount(userId),
        staleTime: 3 * 60 * 1000
    })
}

export default useGetFollowingCount
