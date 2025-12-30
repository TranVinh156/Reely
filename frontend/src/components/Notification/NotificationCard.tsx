import { User } from "lucide-react";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import UserAvatar from "../Profile/UserAvatar";

interface NotificationCardProps {
  username?: string;
  message?: string;
  timestamp?: string;
  avatarUrl?: string;
  videoId?: string;
  type?: string;
}


const NotificationCard: React.FC<NotificationCardProps> = ({
  username,
  message,
  timestamp,
  avatarUrl,
  videoId,
  type
}) => {
  const navigate = useNavigate();
  const isHasAvatar = avatarUrl !== null;

  const content = (
    <>
      <NavLink to={`/users/${username}`} className="flex flex-col justify-center">
        <UserAvatar />
      </NavLink>
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-y-0.5">
        <div className="flex gap-2 items-end">
          <NavLink to={`/users/${username}`} className="text-base font-semibold text-white hover:underline" >{username || 'System'}
          </NavLink>

          <span className="text-[15px] text-white/60 flex-shrink-0 whitespace-nowrap pl-1"> {timestamp || ''}</span>
        </div>

        <div className="flex items-end gap-2">
          <p className="text-sm text-gray-250 overflow-hidden break-words">{message || ''} </p>
        </div>
      </div>
    </>
  );

  if (type === 'follow') {
    return (
      <div className="flex gap-3 px-3 py-2 w-full min-h-18 max-h-70 bg-[#161823] border-b border-b-gray-800">
        {content}
      </div>
    );
  }

  const handleCardClick = (e: React.MouseEvent) => {
    if (videoId) navigate(`/videos/${videoId}`);
  };

  return (
    <div onClick={handleCardClick} key={videoId} className="cursor-pointer flex gap-3 px-3 py-2 w-full min-h-18 max-h-70 bg-[#161823] border-b border-b-gray-800">
      {content}
    </div>
  );
};

export default NotificationCard;