import { getFollowersCount, getFollowing, getFollowingCount } from "@/api/follow"
import Sidebar from "@/components/Layout/Sidebar"
import { useAuth } from "@/hooks/auth/useAuth"
import { Share, UserIcon } from "lucide-react"
import { useEffect, useState } from "react"

const UserProfile = () => {
    const { user } = useAuth()

    const [followingCount, setFollowingCount] = useState<number>(0);
    const [followerCount, setFollowerCount] = useState<number>(0);

    useEffect(() => {
        if (user?.id) {
            getFollowingCount(user.id).then(setFollowingCount)
            getFollowersCount(user.id).then(setFollowerCount)
        }
    }, [user?.id])

    return (
        <div className="flex min-h-screen w-full text-white">
            <Sidebar />

            <div className="flex-1 min-h-screen bg-primary p-4">
                <div className="user-info flex gap-6">
                    {!user?.avatarUrl &&
                        <div className="bg-white w-35 h-35 rounded-full flex items-center justify-center">
                            <UserIcon className="text-black" size={80} />
                        </div>
                    }
                    <div>
                        <div className="flex gap-4 items-center">
                            <p className="font-bold text-xl">{user?.username}</p>
                            <p className="text-sm">{user?.displayName}</p>
                        </div>
                        <div className="text-xs font-bold flex gap-2 mt-2">
                            <button className="bg-red-600 px-8 py-2 rounded-lg">
                                Follow
                            </button>

                            <button className="bg-gray-600 px-8 py-2 rounded-lg">
                                Message
                            </button>
                        </div>
                        <div className="mt-2 flex gap-3">
                            <span>
                                <p className="inline-block font-semibold text-xl pr-1">{followingCount}</p>
                                Following
                            </span>
                            <span>
                                <p className="inline-block font-semibold text-xl pr-1">{followerCount}</p>
                                Follower
                            </span>
                        </div>
                        <p className="mt-2">{user?.bio}</p>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default UserProfile