import {
  Bell,
  Upload,
  Compass,
  MessageCircle,
  Search,
  Sparkle,
  UserRoundPlus,
  Users,
  User2,
  UserIcon,
} from "lucide-react";
import Logo from "./Logo";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import useGetFollowing from "@/hooks/follow/useGetFollowing";
import type { User } from "@/types/user";


interface NavItem {
  icon: any;
  text: string;
  link: string;
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

  const { user, isAuthenticated } = useAuth();
  const { data: following = [] } = useGetFollowing(user?.id || 0);

  const NAV_ITEMS: NavItem[] = [
    { icon: <Sparkle />, text: "For You", link: "/" },
    { icon: <Search />, text: "Search", link: "/search" },
    { icon: <Compass />, text: "Explore", link: "/" },
    { icon: <UserRoundPlus />, text: "Following", link: "/" },
    { icon: <User2 />, text: "Profile", link: user ? `/users/${user.username}` : "/login" },
    { icon: <Bell />, text: "Notification", link: "/" },
    { icon: <Upload />, text: "Upload", link: "/upload" }
  ]

  return (
    <aside className="bg-primary max-w-75 p-4 text-white md:p-6">
      <Logo />

      <div className="-between mt-16 flex w-full flex-col">
        <div className="relative mb-4 hidden md:flex">
          <Search
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-600"
            size={18}
          />
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
          className="hover:bg-primary-hover flex justify-center py-3 hover:rounded-xl hover:text-red-500 md:hidden"
        >
          <Search className="text-white hover:text-red-500" size={24} />
        </NavLink>

        <div className="nav-items">
          {NAV_ITEMS.map((item, index) => {
            return (
              <NavLink
                to={item.link}
                key={index}
                className="hover:bg-primary-hover mt-1 flex justify-center gap-4 py-3 hover:rounded-xl hover:text-red-500 md:justify-normal md:pl-8"
              >
                {item.icon}
                <p className="hidden font-semibold md:flex">{item.text}</p>
              </NavLink>
            );
          })}
        </div>

        {isAuthenticated && (
          <div className="following mt-6 hidden md:block">
            <p className="text-md mb-2 font-semibold">Following accounts</p>
            {following.map((follower, index) => {
              return <FollowingCard key={index} follower={follower} />;
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
