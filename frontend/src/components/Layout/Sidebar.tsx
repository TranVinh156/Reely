
import { Bell, Compass, Search, Sparkle, UserRoundPlus, User2, UserIcon, ChartNoAxesCombined } from "lucide-react";
import Logo from "./Logo";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import useGetFollowing from "@/hooks/follow/useGetFollowing";
import type { User } from "@/types/user";
import { useEffect, useState } from "react";
import Notification from "../Notification/Notification";
import { useFeedStore } from "@/store/feedStore";


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
  const location = useLocation();

  const { user, isAuthenticated } = useAuth()
  const { data: following = [] } = useGetFollowing(user?.id || 0)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const mode = useFeedStore((s) => s.mode);
  const setMode = useFeedStore((s) => s.setMode);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const trimmed = searchText.trim();
    if (!trimmed) return;

    const timeout = setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(trimmed)}&tab=videos`);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchText, navigate]);

  const toggleNotification = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsNotificationOpen(!isNotificationOpen);
  };

  const NAV_ITEMS: NavItem[] = [
    {
      icon: <Sparkle />,
      text: "For You",
      link: "/",
      onClick: () => {
        setMode(user ? "personal" : "public");
      },
    },
    {
      icon: <Compass />,
      text: "Trending",
      link: "/",
      onClick: () => {
        setMode("trending");
      },
    },
    {
      icon: <UserRoundPlus />,
      text: "Following",
      link: "/",
      onClick: () => {
        setMode("following")
      }
    },
    { icon: <User2 />, text: "Profile", link: user ? `/users/${user.username}` : "/login" },
    // { icon: <Upload />, text: "Upload", link: "/upload" }
    { icon: <ChartNoAxesCombined />, text: "Analysis", link: "/analysis" },
    { icon: <Bell />, text: "Notification", link: "#", onClick: toggleNotification }
  ]

  return (
    <>
      <aside className={`bg-primary text-white hidden md:flex flex-col h-screen sticky top-0 border-r border-white/10 transition-all duration-300 ${isNotificationOpen ? 'w-20 p-4' : 'w-72 p-6'}`}>
        <div className={isNotificationOpen ? " origin-center" : ""}>
          <Logo collapsed={isNotificationOpen} />
        </div>

        <div className="flex flex-col -between w-full mt-8">
          <div className={`relative mb-4 ${isNotificationOpen ? 'hidden' : 'hidden md:flex'}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-xl text-black bg-white py-3 pr-4 pl-10 placeholder:text-sm placeholder:font-medium placeholder:text-gray-600"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const trimmed = searchText.trim();
                  if (trimmed) {
                    navigate(`/search?q=${encodeURIComponent(trimmed)}&tab=videos`);
                  }
                }
                if (e.key === "Escape") {
                  setSearchText("");
                  navigate("/search");
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
              const isModeNav = item.text === "For You" || item.text === "Trending" || item.text === "Following";
              const isActiveMode =
                (item.text === "For You" && (mode === "personal" || mode === "public")) ||
                (item.text === "Trending" && mode === "trending") ||
                (item.text === "Following" && mode === "following");
              const isOnFeedRoute = location.pathname === "/" || location.pathname === "/feed";
              const isNotificationNav = item.text === "Notification";
              return (
                <NavLink
                  to={item.link}
                  key={index}
                  onClick={item.onClick}
                  className={({ isActive }) =>
                    `flex gap-4 py-3 mt-1 hover:text-red-500 hover:bg-primary-hover hover:rounded-xl transition-all ${isNotificationOpen ? 'justify-center' : 'justify-center md:justify-normal md:pl-8'
                    } ${isModeNav && isActiveMode && isOnFeedRoute
                      ? 'bg-white/15 rounded-xl'
                      : !isModeNav && !isNotificationNav && isActive
                        ? 'bg-white/15 rounded-xl'
                        : isNotificationNav && isNotificationOpen
                          ? 'bg-white/15 rounded-xl'
                          : ''
                    }`
                  }
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

      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-white/10 flex justify-around items-center px-2 z-40">
        <NavLink
          to="/"
          onClick={() => setMode(user ? "personal" : "public")}
          className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full ${isActive && location.pathname === '/' ? 'text-white' : 'text-gray-500'}`}
        >
          <Sparkle size={24} />
          <span className="text-[10px] mt-1">Home</span>
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-white' : 'text-gray-500'}`}
        >
          <Search size={24} />
          <span className="text-[10px] mt-1">Search</span>
        </NavLink>

        <NavLink
          to="/analysis"
          className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-white' : 'text-gray-500'}`}
        >
          <ChartNoAxesCombined size={24} />
          <span className="text-[10px] mt-1">Analysis</span>
        </NavLink>

        <button
          onClick={toggleNotification}
          className={`flex flex-col items-center justify-center w-full h-full ${isNotificationOpen ? 'text-white' : 'text-gray-500'}`}
        >
          <Bell size={24} />
          <span className="text-[10px] mt-1">Inbox</span>
        </button>

        <NavLink
          to={user ? `/users/${user.username}` : "/login"}
          className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-white' : 'text-gray-500'}`}
        >
          <User2 size={24} />
          <span className="text-[10px] mt-1">Profile</span>
        </NavLink>
      </nav>

      <div
        className={`fixed md:left-20 left-0 top-0 h-[calc(100vh-4rem)] md:h-screen w-full md:w-[350px] bg-primary border-r border-white/10 z-50 shadow-2xl overflow-hidden transition-transform duration-300 ease-in-out ${isNotificationOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ transform: isNotificationOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <Notification onClose={() => setIsNotificationOpen(false)} />
      </div>
    </>
  );
}
