import { useState } from 'react';
import { useIonViewWillEnter } from '@ionic/react';

export const useAdminInstructors = () => {
  const [email, setEmail] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [instructors, setInstructors] = useState<any[]>([]);

  const fetchInstructors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/instructors');
      if (response.ok) {
        const data = await response.json();
        setInstructors(data);
      }
    } catch (error) {
      console.error("Không thể tải danh sách giảng viên");
    }
  };

  useIonViewWillEnter(() => { fetchInstructors(); });

  const handleSendInvite = async () => {
    if (!email) {
      setToastMsg('Vui lòng nhập email giảng viên!');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructorEmail: email })
      });
      const data = await response.json();
      if (response.ok) {
        setToastMsg(`🎉 ${data.message} (Mã: ${data.code_generated})`);
        setEmail(''); 
      } else {
        setToastMsg(data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      setToastMsg('Không thể kết nối đến máy chủ Backend!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/update-role', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole })
      });
      if (response.ok) {
        setToastMsg('Cập nhật quyền thành công!');
        fetchInstructors(); 
      } else {
        setToastMsg('Lỗi khi cập nhật quyền');
      }
    } catch (error) {
      setToastMsg('Lỗi kết nối khi cập nhật quyền');
    }
  };

  const handleDeleteUser = async (userId: number, fullName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản của ${fullName} không?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/delete-user/${userId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setToastMsg('Đã xóa tài khoản thành công!');
          fetchInstructors(); 
        } else {
          setToastMsg('Lỗi khi xóa tài khoản');
        }
      } catch (error) {
        setToastMsg('Lỗi kết nối khi xóa tài khoản');
      }
    }
  };

  return {
    email, setEmail,
    toastMsg, setToastMsg,
    isLoading, instructors,
    handleSendInvite, handleRoleChange, handleDeleteUser
  };
};