import { STORAGE_URL } from "@/utils/constant"
import { UserIcon } from "lucide-react"

interface UserAvatarProps {
    avatarUrl?: string
    size?: number
}

const UserAvatar = ({ avatarUrl, size = 40 }: UserAvatarProps) => {
    return (
        <div
            className={`rounded-full overflow-hidden flex-shrink-0`}
            style={{ width: size, height: size }}
        >
            {!avatarUrl ?
                <div className="bg-white w-full h-full flex items-center justify-center">
                    <UserIcon className="text-black" size={size * 0.6} />
                </div>
                :
                <img src={`${STORAGE_URL}/${avatarUrl}`} className="w-full h-full object-cover" alt="avatar" />
            }
        </div>
    )
}

export default UserAvatar