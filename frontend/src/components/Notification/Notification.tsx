import React, { useState } from "react";
import NotificationCard from "./NotificationCard";
import { X } from "lucide-react";

interface NotificationItem {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  avatarUrl: string;
  type?: 'all' | 'like' | 'comment' | 'follower';
}

const Notification: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');

  // Mock data - thay thế bằng data thật từ API
  const notifications: NotificationItem[] = [
    {
      id: '1',
      username: 'ĐỒNG ĐÔ camping',
      message: 'đã trả lời bình luận của bạn: Check ib em',
      timestamp: '8-24',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
      type: 'comment'
    },
    {
      id: '2',
      username: 'Giang Trường',
      message: 'đã trả lời bình luận của bạn: 🤔',
      timestamp: '4-30',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
      type: 'comment'
    },
    {
      id: '3',
      username: 'Giang Trường',
      message: 'đã bình luận: chill quá anh ơi 🤔',
      timestamp: '2-2',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
      type: 'comment'
    },
    {
      id: '4',
      username: 'Raizel',
      message: 'đã bình luận: hay quaaaaaaa 🤣 🤣 🤣 🤣 🤣 🤣 🤣 🤣',
      timestamp: '2-2',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
      type: 'comment'
    },
    {
      id: '5',
      username: 'Giang Trường',
      message: 'đã bình luận: nghệ sĩ à',
      timestamp: '1-31',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
      type: 'comment'
    },
    {
      id: '6',
      username: 'Đức Anh cày piano',
      message: 'đã bình luận: ở đâu mà đẹp thế 😍',
      timestamp: '1-31',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
      type: 'comment'
    },
    {
      id: '7',
      username: 'Đi Nga thì đổi tên',
      message: 'đã bình luận: chill quá, mình xin ảnh vs đc ko',
      timestamp: '1-31',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
      type: 'comment'
    },
    {
      id: '8',
      username: 'Triệu Tấn',
      message: 'đã bình luận: 🤣',
      timestamp: '2024-7-22',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
      type: 'comment'
    },
    {
      id: '9',
      username: 'Triệu Tấn',
      message: 'đã bình luận: 🤣',
      timestamp: '2024-7-22',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
      type: 'like'
    },
    {
      id: '11',
      username: 'Triệu Tấn',
      message: 'đã bình luận: 🤣',
      timestamp: '2024-7-22',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
      type: 'comment'
    },
    {
      id: '10',
      username: 'Triệu Tấn',
      message: 'đã bình luận: 🤣',
      timestamp: '2024-7-22',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
      type: 'comment'
    }
  ];

  const tabs = [
    { id: 'all', label: 'Tất cả hoạt động' },
    { id: 'like', label: 'Thích' },
    { id: 'comment', label: 'Bình luận' },
    { id: 'follower', label: 'Follower' }
  ];

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab);

  return (
    <div className="w-[450px] h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Thông báo</h1>
        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 py-3 border-b border-gray-800">
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

      {/* Section Label */}
      <div className="px-6 py-3 text-gray-400 text-sm font-medium">
        Trước đây
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2  [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full">
        {filteredNotifications.map(notification => (
          <div
            key={notification.id}
            className="hover:bg-gray-900 transition-colors cursor-pointer border-gray-800/50"
          >
            <NotificationCard
              username={notification.username}
              message={notification.message}
              timestamp={notification.timestamp}
              avatarUrl={notification.avatarUrl}
            />
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Không có thông báo nào
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;