import { useState, useEffect } from 'react';

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [toastMsg, setToastMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Lấy lịch sử thông báo
  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notifications/all');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      setToastMsg('Lỗi kết nối khi tải danh sách thông báo!');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Gửi thông báo mới
  const handleSendNotification = async (payload: { title: string, message: string, target_role: string, type: string }) => {
    setIsLoading(true);
    
    const adminUser = JSON.parse(localStorage.getItem('user') || '{}');
    const sender_id = adminUser.user_id || null;

    try {
      const response = await fetch('http://localhost:5000/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, sender_id })
      });

      if (response.ok) {
        setToastMsg('Đã gửi thông báo thành công!');
        fetchNotifications(); 
        setIsLoading(false);
        return true;
      } else {
        setToastMsg('Lỗi khi gửi thông báo!');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      setToastMsg('Lỗi kết nối đến server!');
      setIsLoading(false);
      return false;
    }
  };

  return {
    notifications, toastMsg, setToastMsg, isLoading, handleSendNotification
  };
};