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
    
    if (window.confirm(`Nâng cấp học viên "${fullName}" thành Giảng viên? Các khóa học họ đang tham gia sẽ bị hủy bỏ. Bạn đồng ý chứ?`)) {
      try {
        const response = await fetch('http://localhost:5000/api/admin/update-role', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, newRole })
        });
        if (response.ok) { setToastMsg('Cập nhật quyền thành công!'); fetchStudents(); }
      } catch (error) { setToastMsg('Lỗi kết nối!'); }
    }
  }

  const handleDeleteUser = async (userId: number, fullName: string) => {
    if (window.confirm(`⚠️ Xóa học viên "${fullName}" sẽ xóa toàn bộ tiến trình học tập của họ. Bạn có chắc chắn?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/delete-user/${userId}`, { method: 'DELETE' });
        if (response.ok) { setToastMsg('Đã xóa thành công!'); fetchStudents(); }
      } catch (error) { setToastMsg('Lỗi kết nối!'); }
    }
  };

  return {
    toastMsg, setToastMsg, fetchStudents, handleRoleChange, handleDeleteUser,
    currentStudents, currentPage, setCurrentPage, totalPages
  };
};