import { useEffect, useState, useCallback, useRef } from 'react';
import axiosClient from '../../utils/axios.client';

interface NotificationItem {
  id: string;
  username: string;
  payload: string;
  timestamp: string;
  avatarUrl: string;
  type?: 'system' | 'like' | 'comment' | 'follow';
}

export const useLongPolling = (userId: number | null) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  
  const lastIdRef = useRef<number>(0);
  const isPollingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Long polling function
  const poll = useCallback(async () => {
    if (!userId || isPollingRef.current) return;

    try {
      isPollingRef.current = true;

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      console.log('🔄 Long polling...', { 
        userId, 
        lastId: lastIdRef.current 
      });

      const response = await axiosClient.get<NotificationItem[]>(
        '/notifications/polling',
        {
          params: {
            userId,
            lastNotificationId: lastIdRef.current || 0,
          },
          signal: abortControllerRef.current.signal,
          timeout: 35000, // 35s (server timeout 30s)
        }
      );

      const newNotifications = response.data;

      if (newNotifications && newNotifications.length > 0) {
        console.log('✅ Received new notifications:', newNotifications.length);

        // Add new notifications to the top
        setNotifications((prev) => {
          const combined = [...newNotifications, ...prev];
          // Remove duplicates
          const unique = combined.filter(
            (notification, index, self) =>
              index === self.findIndex((n) => n.id === notification.id)
          );
          return unique;
        });

        // Update lastId to highest ID
        const maxId = Math.max(
          ...newNotifications.map((n) => parseInt(n.id))
        );
        lastIdRef.current = maxId;

        // Show indicator
        setHasNewNotifications(true);

      } else {
        console.log('📭 No new notifications (timeout)');
      }

      // Continue polling after short delay
      isPollingRef.current = false;
      setTimeout(() => poll(), 500); // 0.5s delay

    } catch (err: any) {
      isPollingRef.current = false;

      // Handle cancellation
      if (err.code === 'ERR_CANCELED') {
        console.log('🚫 Long poll cancelled');
        return;
      }

      // Handle timeout
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setTimeout(() => poll(), 1000);
        return;
      }

      // Retry after 5 seconds on error
      setTimeout(() => poll(), 5000);
    }
  }, [userId]);

  // Start/stop polling based on userId
  useEffect(() => {
    if (!userId) {
      return;
    }

    console.log('🚀 Starting long polling for user:', userId);

    // Start polling
    poll();

    // Cleanup function
    return () => {
      console.log('🛑 Stopping long polling');
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      isPollingRef.current = false;
    };
  }, [userId, poll]);

  // Clear new notification indicator
  const clearNewIndicator = () => {
    setHasNewNotifications(false);
  };

  return {
    notifications,
    hasNewNotifications,
    clearNewIndicator,
  };
};