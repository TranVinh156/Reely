import { Bell, Upload, Compass, MessageCircle, Search, Sparkle, User as UserIcon, UserRoundPlus, Users } from "lucide-react";
import Logo from "./Logo";
import { NavLink } from "react-router-dom";
import type { User } from "@/types/user";
import { useAuth } from "@/hooks/auth/useAuth";
import useGetFollowing from "@/hooks/follow/useGetFollowing";

interface NavItem {
  icon: any
  text: string
  link: string
}

const FollowingCard = ({ follower }: { follower: User }) => {
  return (
    <NavLink to={`/users/${follower.username}`} className="following-card font-semibold flex items-center gap-2 mt-1">
      <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
        <UserIcon className="text-black w-4" />
      </div>
      <div className="info">
        <div className="">{follower.displayName}</div>
        <div className="text-gray-400 text-sm">@{follower.username}</div>
      </div>
    </NavLink>
  )
}

const NAV_ITEMS: NavItem[] = [
  { icon: <Sparkle />, text: "For You", link: "/" },
  { icon: <Compass />, text: "Explore", link: "/" },
  { icon: <UserRoundPlus />, text: "Following", link: "/" },
  { icon: <Users />, text: "Friend", link: "/" },
  { icon: <MessageCircle />, text: "Message", link: "/" },
  { icon: <Bell />, text: "Notification", link: "/" },
  { icon: <Upload />, text: "Upload", link: "/upload"}
]
export default function Sidebar() {
  const { user, isAuthenticated } = useAuth()
  const { data: following = [] } = useGetFollowing(user?.id || 0)

  return (
    <aside className="max-w-75 bg-primary p-4 md:p-6 text-white">
      <Logo />

      <div className="flex flex-col -between w-full mt-16">
        <div className="relative hidden mb-4 md:flex">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-white py-3 pl-10 pr-4 rounded-xl placeholder:text-gray-600 placeholder:font-medium placeholder:text-sm"
          />
        </div>

        <div className="flex py-3 md:hidden justify-center hover:text-red-500 hover:bg-primary-hover hover:rounded-xl">
          <Search className="text-white hover:text-red-500" size={24} />
        </div>

        <div className="nav-items">
          {NAV_ITEMS.map((item, index) => {
            return (
              <NavLink to={item.link} key={index} className="flex gap-4 py-3 justify-center md:justify-normal md:pl-8 mt-1 hover:text-red-500 hover:bg-primary-hover hover:rounded-xl">
                {item.icon}
                <p className="hidden md:flex font-semibold">{item.text}</p>
              </NavLink>
            )
          })}
        </div>

        {isAuthenticated &&
          <div className="hidden md:block following mt-6">
            <p className="font-semibold text-md mb-2">Following accounts</p>
            {following.map((follower, index) => {
              return <FollowingCard key={index} follower={follower} />
            })}
          </div>}
      </div>
    </aside>
  );
}