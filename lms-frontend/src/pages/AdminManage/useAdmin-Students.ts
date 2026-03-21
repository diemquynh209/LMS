import { useState } from 'react';
import { useIonViewWillEnter } from '@ionic/react';

export const useAdminStudents = () => {
  const [toastMsg, setToastMsg] = useState('');
  const [students, setStudents] = useState<any[]>([]);

  // Lấy danh sách HỌC VIÊN từ Backend
  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error("Không thể tải danh sách học viên");
    }
  };

  useIonViewWillEnter(() => { fetchStudents(); });

  const handleRoleChange = async (userId: number, currentRole: string, newRole: string) => {
    if (currentRole === newRole) return; 
    try {
      const response = await fetch('http://localhost:5000/api/admin/update-role', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole })
      });
      if (response.ok) {
        setToastMsg('Cập nhật quyền thành công!');
        fetchStudents(); 
      } else {
        setToastMsg('Lỗi từ Backend: Không thể cập nhật quyền');
      }
    } catch (error) {
      setToastMsg('Lỗi kết nối: Chưa có API cập nhật quyền ở Backend!');
    }
  };

  const handleDeleteUser = async (userId: number, fullName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản của học viên ${fullName} không?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/delete-user/${userId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setToastMsg('Đã xóa tài khoản thành công!');
          fetchStudents(); 
        } else {
          setToastMsg('Lỗi khi xóa tài khoản');
        }
      } catch (error) {
        setToastMsg('Lỗi kết nối khi xóa tài khoản');
      }
    }
  };

  return {
    toastMsg, setToastMsg,
    students,
    handleRoleChange, handleDeleteUser
  };
};