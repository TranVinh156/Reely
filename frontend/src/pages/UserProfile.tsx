import Sidebar from "@/components/Layout/Sidebar"
import FollowModal from "@/components/Profile/FollowModal"
import { useAuth } from "@/hooks/auth/useAuth"
import useGetFollowersCount from "@/hooks/follow/useGetFollowersCount"
import useGetFollowingCount from "@/hooks/follow/useGetFollowingCount"
import useGetUserByUsername from "@/hooks/user/useGetUserByUsername"
import useFollow from "@/hooks/follow/useFollow"
import useUnfollow from "@/hooks/follow/useUnfollow"
import useIsFollowing from "@/hooks/follow/useIsFollowing"
import { useUpload } from "@/hooks/upload/useUploadVideo"
import { Link } from "react-router-dom"
import { UserIcon } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import EditProfileModal from "@/components/Profile/EditProfileModal"
import ChangePasswordModal from "@/components/Profile/ChangePasswordModal"
import VideoSection from "@/components/Profile/VideoSection"
import ActionBar from "@/components/Layout/ActionBar"

type ModalTab = 'followers' | 'following' | null

const UserProfile = () => {
    let params = useParams()
    const { user: currentUser } = useAuth()
    const [modalTab, setModalTab] = useState<ModalTab>(null)
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
    const storageUrl = 'http://localhost:9000'

    const { data: user, error, isLoading, isError } = useGetUserByUsername(params.username || "")
    const { data: followingCount = 0 } = useGetFollowingCount(user?.id || 0)
    const { data: followerCount = 0 } = useGetFollowersCount(user?.id || 0)

    const { data: isFollowingUser = false } = useIsFollowing(
        currentUser?.id || 0,
        user?.id || 0,
        !!currentUser && !!user && currentUser.id !== user.id
    )

    const { mutate: followUser, isPending: isFollowing } = useFollow()
    const { mutate: unfollowUser, isPending: isUnfollowing } = useUnfollow()
    
    const handleFollowToggle = () => {
        if (!currentUser || !user) return

        if (isFollowingUser) {
            unfollowUser({
                followerId: currentUser.id,
                followingId: user.id
            })
        } else {
            followUser({
                followerId: currentUser.id,
                followingId: user.id
            })
        }
    }

    let content = null

    if (isLoading) {
        content = (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-300">Loading user...</p>
            </div>
        )
    } else if (isError) {
        content = (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-xl font-semibold mb-2">User not found</p>
                    <p className="text-gray-400 mb-4">{(error as any)?.response?.data?.message || 'We could not find that user.'}</p>
                    <Link to="/" className="inline-block bg-red-600 px-4 py-2 rounded-lg">Go home</Link>
                </div>
            </div>
        )
    } else {
        content = (
            <div className="user-info flex flex-col gap-8 md:gap-12 pb-20 md:pb-0">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="w-24 h-24 md:w-35 md:h-35 flex-shrink-0">
                        {!user?.avatarUrl ?
                            <div className="bg-white w-full h-full rounded-full flex items-center justify-center">
                                <UserIcon className="text-black md:w-20 md:h-20" size={40}  />
                            </div>
                            :
                            <img src={`${storageUrl}/${user?.avatarUrl}`} alt={user?.username} className="w-full h-full rounded-full object-cover" />
                        }
                    </div>
                    <div className="flex flex-col items-center md:items-start w-full">
                        <div className="flex gap-4 items-center">
                            <p className="font-bold text-xl">@{user?.username}</p>
                            <p className="text-sm">{user?.displayName}</p>
                        </div>
                        <div className="text-xs font-bold flex flex-wrap justify-center md:justify-start gap-2 mt-2 w-full">
                            {params.username !== currentUser?.username ?
                                <>
                                    <button
                                        onClick={handleFollowToggle}
                                        disabled={isFollowing || isUnfollowing}
                                        className={`px-8 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isFollowingUser
                                            ? 'bg-gray-600 hover:bg-gray-700'
                                            : 'bg-red-600 hover:bg-red-700'
                                            }`}
                                    >
                                        {isFollowing || isUnfollowing
                                            ? 'Loading...'
                                            : isFollowingUser
                                                ? 'Unfollow'
                                                : 'Follow'
                                        }
                                    </button>
                                    <button className="bg-gray-600 px-8 py-2 rounded-lg">
                                        Message
                                    </button>
                                </> :
                                <>
                                    <button onClick={() => setIsEditProfileOpen(true)} className="bg-red-600 px-8 py-2 rounded-lg">
                                        Edit Profile
                                    </button>
                                    <button onClick={() => setIsChangePasswordOpen(true)} className="bg-gray-600 px-6 py-2 rounded-lg">
                                        Change Password
                                    </button>
                                </>
                            }
                        </div>
                        <div className="mt-4 flex gap-6 justify-center md:justify-start">
                            <span
                                onClick={() => setModalTab('following')}
                                className="cursor-pointer hover:text-gray-300 flex items-center gap-1"
                            >
                                <span className="font-bold text-lg">{followingCount}</span>
                                <span className="text-gray-400 text-sm">Following</span>
                            </span>
                            <span
                                onClick={() => setModalTab('followers')}
                                className="cursor-pointer hover:text-gray-300 flex items-center gap-1"
                            >
                                <span className="font-bold text-lg">{followerCount}</span>
                                <span className="text-gray-400 text-sm">Followers</span>
                            </span>
                        </div>
                        <p className="mt-4 text-center md:text-left max-w-md">{user?.bio}</p>
                    </div>
                </div>
                <VideoSection userId={user?.id || 0} />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen w-full text-white">
            <Sidebar />

            <div className="flex-1 min-h-screen bg-primary p-4">
                {content}
            </div>

            <FollowModal
                userId={user?.id || 0}
                username={user?.username || 'user'}
                isOpen={modalTab !== null}
                onClose={() => setModalTab(null)}
                defaultTab={modalTab || 'following'}
            />

            <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
            <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />

            <ActionBar/>
        </div>
    )
}

export default UserProfile