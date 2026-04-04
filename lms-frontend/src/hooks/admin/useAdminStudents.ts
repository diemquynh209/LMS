import { useState, useMemo } from 'react';
import { useIonViewWillEnter } from '@ionic/react';

export const useAdminStudents = () => {
  const [toastMsg, setToastMsg] = useState('');
  const [students, setStudents] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchStudents = async (searchTerm: string = '') => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/students?search=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const data = await response.json();
        setStudents(Array.isArray(data) ? data : []);
        setCurrentPage(1); 
      }
    } catch (error) {
      console.error("Không thể tải danh sách học viên");
    }
  };

  useIonViewWillEnter(() => { fetchStudents(); });

  const totalPages = Math.ceil(students.length / itemsPerPage);

  const currentStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return students.slice(startIndex, endIndex);
  }, [students, currentPage]);

  const handleRoleChange = async (userId: number, fullName: string, currentRole: string, newRole: string) => {
    if (currentRole === newRole) return; 
    
    if (window.confirm(`Nâng cấp học viên "${fullName}" thành Giảng viên? Các khóa học họ đang tham gia có thể bị ảnh hưởng. Bạn đồng ý chứ?`)) {
      try {
        const response = await fetch('http://localhost:5000/api/admin/update-role', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, newRole })
        });
        if (response.ok) { setToastMsg('Cập nhật quyền thành công!'); fetchStudents(); }
      } catch (error) { setToastMsg('Lỗi kết nối!'); }
    }
  }

  const handleToggleStatus = async (userId: number, fullName: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Locked' : 'Active';
    const actionText = newStatus === 'Locked' ? 'KHÓA' : 'MỞ KHÓA';

    if (window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản của học viên "${fullName}"?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, { 
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        if (response.ok) { 
          setToastMsg(`Đã ${actionText.toLowerCase()} tài khoản thành công!`); 
          fetchStudents(); 
        } else {
          setToastMsg('Lỗi khi cập nhật trạng thái!');
        }
      } catch (error) { setToastMsg('Lỗi kết nối!'); }
    }
  };

  return {
    toastMsg, setToastMsg, fetchStudents, handleRoleChange, handleToggleStatus,
    currentStudents, currentPage, setCurrentPage, totalPages
  };
};