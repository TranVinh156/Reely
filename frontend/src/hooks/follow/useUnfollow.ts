import { unfollow } from "@/api/follow"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface UnfollowParams {
    followerId: number
    followingId: number
}

const useUnfollow = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ followerId, followingId }: UnfollowParams) =>
            unfollow(followerId, followingId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['following', variables.followerId] })
            queryClient.invalidateQueries({ queryKey: ['followers', variables.followingId] })
            queryClient.invalidateQueries({ queryKey: ['followingCount', variables.followerId] })
            queryClient.invalidateQueries({ queryKey: ['followersCount', variables.followingId] })
            queryClient.invalidateQueries({ queryKey: ['isFollowing', variables.followerId, variables.followingId] })
        },
    })
}

export default useUnfollow
