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

export const useLongPolling = (userId: number | undefined) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  
  const lastIdRef = useRef<number>(0);
  const isPollingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const poll = useCallback(async () => {
    if (!userId || isPollingRef.current) return;

    try {
      isPollingRef.current = true;

      abortControllerRef.current = new AbortController();

      const response = await axiosClient.get<NotificationItem[]>(
        '/notifications/polling',
        {
          params: {
            userId,
            lastNotificationId: lastIdRef.current || 0,
          },
          signal: abortControllerRef.current.signal,
          timeout: 35000,
        }
      );

      const newNotifications = response.data;

      if (newNotifications && newNotifications.length > 0) {
        setNotifications((prev) => {
          const combined = [...newNotifications, ...prev];
          const unique = combined.filter(
            (notification, index, self) =>
              index === self.findIndex((n) => n.id === notification.id)
          );
          return unique;
        });

        const maxId = Math.max(
          ...newNotifications.map((n) => parseInt(n.id))
        );
        lastIdRef.current = maxId;

        setHasNewNotifications(true);

      }

      isPollingRef.current = false;
      setTimeout(() => poll(), 500);

    } catch (err: any) {
      isPollingRef.current = false;

      if (err.code === 'ERR_CANCELED') {
        return;
      }

      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setTimeout(() => poll(), 1000);
        return;
      }

      setTimeout(() => poll(), 5000);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    poll();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      isPollingRef.current = false;
    };
  }, [userId, poll]);

  const clearNewIndicator = () => {
    setHasNewNotifications(false);
  };

  return {
    notifications,
    hasNewNotifications,
    clearNewIndicator,
  };
};