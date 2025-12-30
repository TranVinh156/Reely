import React from "react";

interface NotificationCardProps {
  username?: string;
  message?: string;
  timestamp?: string;
  avatarUrl?: string;
}


const NotificationCard: React.FC<NotificationCardProps> = ({
  username,
  message,
  timestamp,
  avatarUrl
}) => {
  avatarUrl = "http://localhost:9000/" + avatarUrl;

  return (
    <div className="flex gap-3 px-3 py-2 w-full min-h-18 max-h-70 bg-[#161823]">
      {/* Avatar */}
      <div className="flex flex-col justify-center">
        <img
          src={avatarUrl || '/system-avatar.png'}
          alt={username ? `${username} system` : 'system'}
          className="w-13 h-13 rounded-full flex-shrink-0 object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-y-0.5">
        <h4 className="text-base font-semibold text-white">{username || 'System'}
          <span className="text-[15px] text-white/60 flex-shrink-0 whitespace-nowrap pl-1"> {timestamp || ''}</span>
        </h4>
        <div className="flex items-end gap-2 ">
          <p className="text-sm text-white overflow-hidden break-words">{message || ''} </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;