import { UserIcon, X } from "lucide-react"
import useGetFollowers from "@/hooks/follow/useGetFollowers"
import useGetFollowing from "@/hooks/follow/useGetFollowing"
import { useState } from "react"
import useUnfollow from "@/hooks/follow/useUnfollow"

interface FollowModalProps {
    userId: number
    username: string
    isOpen: boolean
    onClose: () => void
    defaultTab?: 'followers' | 'following'
}

const FollowModal = ({ userId, username, isOpen, onClose, defaultTab = 'following' }: FollowModalProps) => {
    const [activeTab, setActiveTab] = useState<'followers' | 'following'>(defaultTab)

    const { data: followers = [], isLoading: isLoadingFollowers } = useGetFollowers(userId, isOpen && activeTab === 'followers')
    const { data: following = [], isLoading: isLoadingFollowing } = useGetFollowing(userId, isOpen && activeTab === 'following')
    const { mutate: unfollowUser, isPending } = useUnfollow()

    const handleUnfollow = (followingId: number) => {
        unfollowUser({
            followerId: userId,
            followingId: followingId
        })
    }

    if (!isOpen) return null

    const currentData = activeTab === 'followers' ? followers : following
    const isLoading = activeTab === 'followers' ? isLoadingFollowers : isLoadingFollowing
    const emptyMessage = activeTab === 'followers' ? 'No followers yet' : 'Not following anyone yet'

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-primary-hover rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {username}
                    </h2>
                    <button
                        onClick={onClose}
                        className="hover:bg-primary rounded-full p-1"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-4 border-b border-gray-600">
                    <button
                        onClick={() => setActiveTab('following')}
                        className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'following'
                            ? 'text-red-500 border-b-2 border-red-500'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Following
                    </button>
                    <button
                        onClick={() => setActiveTab('followers')}
                        className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'followers'
                            ? 'text-red-500 border-b-2 border-red-500'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Followers
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-3 overflow-y-auto flex-1">
                    {isLoading ? (
                        <p className="text-gray-400 text-center py-4">Loading...</p>
                    ) : currentData.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">{emptyMessage}</p>
                    ) : (
                        currentData.map((user) => (
                            <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-primary rounded-lg cursor-pointer">
                                <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.username} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <UserIcon className="text-black w-5" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold truncate">{user.displayName}</p>
                                    <p className="text-sm text-gray-400 truncate">@{user.username}</p>
                                </div>
                                {activeTab === "following" &&
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleUnfollow(user.id)
                                        }}
                                        disabled={isPending}
                                        className="px-4 py-2 bg-gray-700 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isPending ? 'Unfollowing...' : 'Following'}
                                    </button>
                                }
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default FollowModal
