import { isFollowing } from "@/api/follow"
import { useQuery } from "@tanstack/react-query"

const useIsFollowing = (followerId: number, followingId: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['isFollowing', followerId, followingId],
        queryFn: () => isFollowing(followerId, followingId),
        enabled: enabled && followerId > 0 && followingId > 0,
    })
}

export default useIsFollowing
