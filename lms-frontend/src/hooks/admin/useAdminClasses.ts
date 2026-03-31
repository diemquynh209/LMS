import { useState, useMemo } from 'react';
import { useIonViewWillEnter } from '@ionic/react';

export const useAdminClasses = () => {
  const [toastMsg, setToastMsg] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchClasses = async (searchTerm: string = '') => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/classes?search=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const data = await response.json();
        setClasses(Array.isArray(data) ? data : []);
        setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
      }
    } catch (error) {
      console.error("Không thể tải danh sách lớp học");
    }
  };

  useIonViewWillEnter(() => { fetchClasses(); });
  const totalPages = Math.ceil(classes.length / itemsPerPage);

  const currentClasses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return classes.slice(startIndex, endIndex);
  }, [classes, currentPage]);

  const handleDeleteClass = async (classId: number, className: string) => {
    if (window.confirm(`NGUY HIỂM: Bạn có chắc chắn muốn xóa toàn bộ lớp học "${className}" không? Các bài giảng bên trong cũng sẽ bị ảnh hưởng!`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/delete-class/${classId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setToastMsg('Đã xóa lớp học thành công!');
          fetchClasses();
        } else {
          setToastMsg('Lỗi khi xóa lớp học');
        }
      } catch (error) {
        setToastMsg('Lỗi kết nối khi xóa lớp học');
      }
    }
  };

  const handleUpdateStatus = async (classId: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/update-class-status/${classId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setToastMsg('Đã cập nhật trạng thái lớp học!');
        fetchClasses();
      } else {
        setToastMsg('Lỗi khi cập nhật trạng thái!');
      }
    } catch (error) {
      setToastMsg('Lỗi kết nối đến server!');
    }
  };

  return {
    toastMsg, setToastMsg,
    fetchClasses, handleDeleteClass, handleUpdateStatus,
    currentClasses, currentPage, setCurrentPage, totalPages
  };

};