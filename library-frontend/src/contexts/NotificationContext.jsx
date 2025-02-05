import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { wsService } from '../services/websocket';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetchNotifications();
    
    try {
      wsService.connect();
      
      const unsubscribe = wsService.subscribe((data) => {
        if (data.type === 'connection' && data.status === 'connected') {
          setWsConnected(true);
        } else if (data.type === 'notification') {
          setNotifications(prev => [data.notification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      });

      return () => {
        unsubscribe();
        wsService.disconnect();
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return; // Don't fetch if not logged in

      const response = await api.get('/notifications');
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.is_read).length);
    } catch (error) {
      if (error.response?.status !== 401) { // Ignore unauthorized errors
        console.error('Failed to fetch notifications:', error);
      }
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n => 
        n.notification_id === notificationId ? { ...n, is_read: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications(notifications.filter(n => n.notification_id !== notificationId));
      if (!notifications.find(n => n.notification_id === notificationId)?.is_read) {
        setUnreadCount(prev => prev - 1);
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      deleteNotification,
      fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext); 