import { Bell, Compass, MessageCircle, Search, Sparkle, User as UserIcon, UserRoundPlus, Users } from "lucide-react";
import Logo from "./Logo";
import { NavLink } from "react-router-dom";
import type { User } from "@/types/user";
import { getFollowing } from "@/api/follow";
import { useAuth } from "@/hooks/auth/useAuth";
import { useEffect, useState } from "react";

interface NavItem {
  icon: any
  text: string
  link: string
}

const FollowingCard = ({ follower }: { follower: User }) => {
  return (
    <div className="following-card font-semibold flex items-center gap-2 mt-1">
      <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
        <UserIcon className="text-black w-4" />
      </div>
      <div className="info">
        <div className="">{follower.displayName}</div>
        <div className="text-gray-400 text-sm">{follower.username}</div>
      </div>
    </div>
  )
}

const NAV_ITEMS: NavItem[] = [
  { icon: <Sparkle />, text: "For You", link: "/" },
  { icon: <Compass />, text: "Explore", link: "/" },
  { icon: <UserRoundPlus />, text: "Following", link: "/" },
  { icon: <Users />, text: "Friend", link: "/" },
  { icon: <MessageCircle />, text: "Message", link: "/" },
  { icon: <Bell />, text: "Notification", link: "/" }
]
export default function Sidebar() {
  const { user, isAuthenticated } = useAuth()
  const [following, setFollowing] = useState<User[]>([])

  useEffect(() => {
    if (user?.id) {
      getFollowing(user.id).then(setFollowing)
    }
  }, [user?.id])

  return (
    <aside className="max-w-75 bg-primary p-6 text-white">
      <Logo />

      <div className="flex flex-col -between w-full mt-16">
        <div className="relative hidden sm:flex">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-white py-3 pl-10 pr-4 rounded-xl placeholder:text-gray-600 placeholder:font-medium placeholder:text-sm"
          />
        </div>

        <div className="nav-items mt-4">
          {NAV_ITEMS.map((item) => {
            return (
              <NavLink to={item.link} className="flex gap-4 py-3 justify-center sm:justify-normal sm:pl-8 mt-1 hover:text-red-500 hover:bg-primary-hover hover:rounded-xl">
                {item.icon}
                <p className="hidden sm:flex font-semibold">{item.text}</p>
              </NavLink>
            )
          })}
        </div>

        {isAuthenticated &&
          <div className="hidden sm:block following mt-6">
            <p className="font-semibold text-md mb-2">Following accounts</p>
            {following.map(follower => {
              return <FollowingCard follower={follower} />
            })}
          </div>}
      </div>
    </aside>
  );
}