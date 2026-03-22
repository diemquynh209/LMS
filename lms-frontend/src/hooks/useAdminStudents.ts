import { useState } from 'react';
import { useIonViewWillEnter } from '@ionic/react';

export const useAdminStudents = () => {
  const [toastMsg, setToastMsg] = useState('');
  const [students, setStudents] = useState<any[]>([]);

  const fetchStudents = async (searchTerm: string = '') => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/students?search=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const data = await response.json();
        setStudents(Array.isArray(data) ? data : []);
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
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole })
      });
      if (response.ok) { setToastMsg('Cập nhật quyền thành công!'); fetchStudents(); }
    } catch (error) { setToastMsg('Lỗi kết nối!'); }
  };

  const handleDeleteUser = async (userId: number, fullName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản của ${fullName}?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/delete-user/${userId}`, { method: 'DELETE' });
        if (response.ok) { setToastMsg('Đã xóa thành công!'); fetchStudents(); }
      } catch (error) { setToastMsg('Lỗi kết nối!'); }
    }
  };

  return {
    toastMsg, setToastMsg, students,
    fetchStudents, 
    handleRoleChange, handleDeleteUser
  };
};