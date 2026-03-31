import { useState, useMemo } from 'react';
import { useIonViewWillEnter } from '@ionic/react';

export const useAdminInstructors = () => {
  const [email, setEmail] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [instructors, setInstructors] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchInstructors = async (searchTerm: string = '') => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/instructors?search=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const data = await response.json();
        setInstructors(Array.isArray(data) ? data : []);
        setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
      }
    } catch (error) { console.error("Không thể tải danh sách"); }
  };

  useIonViewWillEnter(() => { fetchInstructors(); });
  const totalPages = Math.ceil(instructors.length / itemsPerPage);

  const currentInstructors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return instructors.slice(startIndex, endIndex);
  }, [instructors, currentPage]);

  const handleSendInvite = async () => { 
      if (!email) { setToastMsg('Vui lòng nhập email!'); return; }
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/admin/invite', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ instructorEmail: email })
        });
        const data = await response.json();
        if (response.ok) { setToastMsg(`🎉 ${data.message}`); setEmail(''); } 
        else { setToastMsg(data.message); }
      } catch (error) { setToastMsg('Lỗi kết nối!'); } finally { setIsLoading(false); }
  };

  const handleRoleChange = async (userId: number, fullName: string, newRole: string) => {
    if (window.confirm(`Hạ giảng viên "${fullName}" đồng thời sẽ xóa các lớp học của họ. Bạn có đồng ý?`)) {
      try {
        const response = await fetch('http://localhost:5000/api/admin/update-role', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, newRole })
        });
        if (response.ok) { 
          setToastMsg('Hạ cấp và xóa lớp học thành công!'); 
          fetchInstructors(); 
        }
      } catch (error) { setToastMsg('Lỗi kết nối'); }
    }
  };
  
  const handleDeleteUser = async (userId: number, fullName: string) => { 
    if (window.confirm(`Xóa giảng viên "${fullName}" sẽ xóa các lớp học của họ. Bạn có đồng ý?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/delete-user/${userId}`, { method: 'DELETE' });
        if (response.ok) { 
          setToastMsg('Đã xóa giảng viên và lớp học!'); 
          fetchInstructors(); 
        }
      } catch (error) { setToastMsg('Lỗi kết nối'); }
    }
  };

  return {
    email, setEmail, toastMsg, setToastMsg, isLoading,
    fetchInstructors, handleSendInvite, handleRoleChange, handleDeleteUser,
    currentInstructors, currentPage, setCurrentPage, totalPages
  };
};