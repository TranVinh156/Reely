import React, { useEffect, useState } from "react";
import NotificationCard from "./NotificationCard";  
import { X } from "lucide-react";
import axiosClient from "@/utils/axios.client";
import { formatTimestamp } from "@/utils/formatTimestamp";
import { useLongPolling } from "@/hooks/notification/useLongPolling";
import { useAuth } from "@/hooks/auth/useAuth";


interface NotificationItem {
  id: string;
  username: string;
  payload: string;
  timestamp: string;
  avatarUrl: string;
  type?: 'system' | 'like' | 'comment' | 'follow';
}

interface NotificationProps {
  onClose?: () => void;
}

// interface NotificationPayload {
//   actorId: number;
//   actorUsername: string;
//   actorAvatar: string;
//   message: string;
//   videoId?: number;
//   commentId?: number;
//   parentCommentId?: number;
// }


const Notification: React.FC<NotificationProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const {user} = useAuth();

  const { 
    notifications: liveNotifications, 
    hasNewNotifications,
    clearNewIndicator 
  } = useLongPolling(user?.id);


  useEffect(() => {
    setNotifications([]);
    fetchNotifications(0);
  }, [user?.id]);


  useEffect(() => {
    if (liveNotifications.length > 0) {
      setNotifications((prev) => {
        const existingIds = new Set(prev.map(n => n.id));
        const newOnes = liveNotifications.filter(n => !existingIds.has(n.id));
        return [...newOnes, ...prev];
      });
      
      // Clear new indicator after 3 seconds
      setTimeout(() => clearNewIndicator(), 3000);
    }
  }, [liveNotifications]);



  const fetchNotifications = async(page: number) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get(`/notifications?userId=${user?.id}&page=${page}&size=30`);
      const existingIds = new Set(notifications.map(n => n.id));
      const uniqueNew = response.data.data.filter((n: NotificationItem) => {
          return !existingIds.has(n.id)
      });
      console.log(response.data)
      setNotifications(prev => [...prev, ...uniqueNew]);
      setHasMore(page < response.data.totalPages - 1);
      setCurrentPage(page)
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const {scrollTop, scrollHeight, clientHeight} = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 50 && hasMore && !isLoading) {
      fetchNotifications(currentPage + 1);
    }
  }

  // const parsePayloadMessage = (payloadString: string): string => {
  //   const payload = JSON.parse(payloadString);
  //   if (payload) {
  //     if (payload.videoId) {
  //       return `${payload.message} on video ID ${payload.videoId}`;
  //     }
  //     else if (payload.commentId) {
  //       return `${payload.message} on comment ID ${payload.commentId}`;
  //     } else {
  //       return payload.message;
  //     }
  //   }
  //   return '';
  // };
  

  const tabs = [
    { id: 'all', label: 'Tất cả hoạt động' },
    { id: 'like', label: 'Thích' },
    { id: 'comment', label: 'Bình luận' },
    { id: 'follow', label: 'Follower' },
    { id: 'system', label: 'Hệ thống'}
  ];

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab);

  return (
    <div className="w-[350px] h-screen bg-[#161823] text-white flex flex-col border-l border-gray-800">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Thông báo</h1>
        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <div className="flex gap-2 px-4 py-3 border-b border-gray-800 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-black'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-6 py-3 text-gray-400 text-sm font-medium">
        Trước đây
      </div>

      

      {isLoading && (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}

      {!isLoading && filteredNotifications.length === 0 && (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Không có thông báo nào
        </div>
      )}

      {!isLoading && (
        <div
        className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2  [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full"
        onScroll={handleScroll}
        >
          {filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className="hover:bg-gray-900 transition-colors cursor-pointer border-gray-800/50"
            >
              <NotificationCard
                key={notification.id}
                username={JSON.parse(notification.payload).actorUsername}
                message={JSON.parse(notification.payload).message}
                timestamp={formatTimestamp(notification.timestamp)}
                avatarUrl={JSON.parse(notification.payload).actorAvatar}
                videoId={JSON.parse(notification.payload).videoId}
                type={notification.type}
              />
            </div>
          ))}

          {isLoading && notifications.length > 0 && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      )}
      
    </div>
  );
};

export default Notification;