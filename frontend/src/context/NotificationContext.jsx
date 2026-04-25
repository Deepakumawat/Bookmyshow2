import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationTypes, notificationChannels } from '../data/notificationTemplates';

export const NotificationContext = createContext();

const defaultPreferences = {
  [notificationTypes.BOOKING_CONFIRMATION]: { email: true, sms: true, push: true, inApp: true },
  [notificationTypes.PAYMENT_SUCCESS]: { email: true, sms: true, push: true, inApp: true },
  [notificationTypes.PAYMENT_FAILED]: { email: true, sms: true, push: true, inApp: true },
  [notificationTypes.BOOKING_REMINDER]: { email: true, sms: true, push: true, inApp: true },
  [notificationTypes.REFUND_INITIATED]: { email: true, sms: true, push: false, inApp: true },
  [notificationTypes.REFUND_COMPLETED]: { email: true, sms: true, push: false, inApp: true },
  [notificationTypes.LOYALTY_POINTS_EARNED]: { email: true, sms: false, push: true, inApp: true },
  [notificationTypes.TIER_UPGRADE]: { email: true, sms: true, push: true, inApp: true },
  [notificationTypes.OFFER_AVAILABLE]: { email: true, sms: true, push: true, inApp: true },
  [notificationTypes.REVIEW_REMINDER]: { email: true, sms: false, push: false, inApp: true },
  [notificationTypes.SPECIAL_OFFER]: { email: true, sms: true, push: true, inApp: true },
  [notificationTypes.CANCELLATION_CONFIRMATION]: { email: true, sms: true, push: false, inApp: true },
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('notificationPreferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load preferences:', e);
      }
    }

    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (e) {
        console.error('Failed to load notifications:', e);
      }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Update unread count
  useEffect(() => {
    const count = notifications.filter((n) => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const addNotification = (notification) => {
    const newNotification = {
      id: `notif_${Date.now()}`,
      timestamp: new Date(),
      read: false,
      ...notification,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Show toast for high priority notifications
    if (notification.priority === 'high' || notification.priority === 'medium') {
      showToast(notification.title, notification.icon);
    }

    return newNotification;
  };

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updatePreference = (notificationType, channel, enabled) => {
    setPreferences((prev) => ({
      ...prev,
      [notificationType]: {
        ...prev[notificationType],
        [channel]: enabled,
      },
    }));
  };

  const updateAllPreferences = (notificationType, enabled) => {
    const updated = {
      email: enabled,
      sms: enabled,
      push: enabled,
      inApp: enabled,
    };
    setPreferences((prev) => ({
      ...prev,
      [notificationType]: updated,
    }));
  };

  const getPreference = (notificationType, channel) => {
    return preferences[notificationType]?.[channel] ?? true;
  };

  const showToast = (message, icon = '📢') => {
    setToastMessage({ message, icon });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const sendNotification = (type, data, channels = ['email', 'sms', 'push', 'inApp']) => {
    const notification = {
      type,
      title: `${data.emoji || '📢'} ${data.title || type}`,
      message: data.message,
      icon: data.emoji,
      priority: data.priority || 'medium',
      data,
    };

    // Check user preferences for each channel
    const enabledChannels = channels.filter((channel) =>
      getPreference(type, channel)
    );

    if (enabledChannels.length > 0) {
      addNotification({ ...notification, channels: enabledChannels });
    }

    return notification;
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        preferences,
        unreadCount,
        toastMessage,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        updatePreference,
        updateAllPreferences,
        getPreference,
        showToast,
        sendNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
