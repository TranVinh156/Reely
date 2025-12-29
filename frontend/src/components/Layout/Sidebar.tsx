
import { Bell, Upload, Compass, MessageCircle, Search, Sparkle, UserRoundPlus, Users, User2, UserIcon, ChartNoAxesCombined } from "lucide-react";
import Logo from "./Logo";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import useGetFollowing from "@/hooks/follow/useGetFollowing";
import type { User } from "@/types/user";
import { useState } from "react";
import Notification from "../Notification/Notification";


interface NavItem {
  icon: any
  text: string
  link: string
  onClick?: (e: React.MouseEvent) => void
}

const FollowingCard = ({ follower }: { follower: User }) => {
  return (
    <NavLink
      to={`/users/${follower.username}`}
      className="following-card mt-1 flex items-center gap-2 font-semibold"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
        <UserIcon className="w-4 text-black" />
      </div>
      <div className="info">
        <div className="">{follower.displayName}</div>
        <div className="text-sm text-gray-400">@{follower.username}</div>
      </div>
    </NavLink>
  );
};

export default function Sidebar() {
  const navigate = useNavigate();


  const { user, isAuthenticated } = useAuth()
  const { data: following = [] } = useGetFollowing(user?.id || 0)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const toggleNotification = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNotificationOpen(!isNotificationOpen);
  };

  const NAV_ITEMS: NavItem[] = [
    { icon: <Sparkle />, text: "For You", link: "/" },
    { icon: <Search />, text: "Search", link: "/search" },
    { icon: <Compass />, text: "Explore", link: "/" },
    { icon: <UserRoundPlus />, text: "Following", link: "/" },
    { icon: <User2 />, text: "Profile", link: user ? `/users/${user.username}` : "/login" },
    // { icon: <Upload />, text: "Upload", link: "/upload" }
    { icon: <ChartNoAxesCombined />, text: "Analysis", link: "/analysis" },
    { icon: <Bell />, text: "Notification", link: "#", onClick: toggleNotification }    
  ]

  return (
    <>
    <aside className={`bg-primary text-white flex flex-col h-screen sticky top-0 border-r border-white/10 transition-all duration-300 ${isNotificationOpen ? 'w-20 p-4' : 'w-20 md:w-72 p-4 md:p-6'}`}>
      <div className={isNotificationOpen ? " origin-center" : ""}>
        <Logo collapsed={isNotificationOpen} />
      </div>

      <div className="flex flex-col -between w-full mt-8">
        <div className={`relative mb-4 ${isNotificationOpen ? 'hidden' : 'hidden md:flex'}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-xl bg-white py-3 pr-4 pl-10 placeholder:text-sm placeholder:font-medium placeholder:text-gray-600"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = (e.target as HTMLInputElement).value;
                navigate(`/search?q=${encodeURIComponent(val)}&tab=videos`);
              }
            }}
          />
        </div>

        <NavLink
          to="/search"
          className={`flex py-3 justify-center hover:text-red-500 hover:bg-primary-hover hover:rounded-xl cursor-pointer ${isNotificationOpen ? 'flex' : 'md:hidden'}`}
        >
          <Search className="text-white hover:text-red-500" size={24} />
        </NavLink>

        <div className="nav-items">
          {NAV_ITEMS.map((item, index) => {
            return (
              <NavLink 
                to={item.link} 
                key={index} 
                onClick={item.onClick}
                className={`flex gap-4 py-3 mt-1 hover:text-red-500 hover:bg-primary-hover hover:rounded-xl transition-all ${isNotificationOpen ? 'justify-center' : 'justify-center md:justify-normal md:pl-8'}`}
              >
                {item.icon}
                <p className={`font-semibold ${isNotificationOpen ? 'hidden' : 'hidden md:flex'}`}>{item.text}</p>
              </NavLink>
            );
          })}
        </div>

        {isAuthenticated &&
          <div className={`following mt-6 ${isNotificationOpen ? 'hidden' : 'hidden md:block'}`}>
            <p className="font-semibold text-md mb-2">Following accounts</p>
            {following.map((follower, index) => {
              return <FollowingCard key={index} follower={follower} />;
            })}
          </div>
        }
      </div>
    </aside>
    
    <div 
        className={`fixed left-20 top-0 h-screen w-[450px] bg-primary border-r border-white/10 z-50 shadow-2xl overflow-hidden transition-transform duration-300 ease-in-out ${isNotificationOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ transform: isNotificationOpen ? 'translateX(0)' : 'translateX(-100%)' }}
    >
       <Notification onClose={() => setIsNotificationOpen(false)} />
    </div>
    </>
  );
}
