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
    if (window.confirm(`Hạ giảng viên "${fullName}" đồng thời sẽ đóng các lớp học của họ. Bạn có đồng ý?`)) {
      try {
        const response = await fetch('http://localhost:5000/api/admin/update-role', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, newRole })
        });
        if (response.ok) { 
          setToastMsg('Hạ cấp thành công!'); 
          fetchInstructors(); 
        }
      } catch (error) { setToastMsg('Lỗi kết nối'); }
    }
  };
  
  const handleToggleStatus = async (userId: number, fullName: string, currentStatus: string) => { 
    const newStatus = currentStatus === 'Active' ? 'Locked' : 'Active';
    const actionText = newStatus === 'Locked' ? 'KHÓA' : 'MỞ KHÓA';

    if (window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản của giảng viên "${fullName}"?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, { 
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        if (response.ok) { 
          setToastMsg(`Đã ${actionText.toLowerCase()} tài khoản thành công!`); 
          fetchInstructors(); 
        } else {
          setToastMsg('Lỗi khi cập nhật trạng thái!');
        }
      } catch (error) { setToastMsg('Lỗi kết nối'); }
    }
  };

  return {
    email, setEmail, toastMsg, setToastMsg, isLoading,
    fetchInstructors, handleSendInvite, handleRoleChange, handleToggleStatus,
    currentInstructors, currentPage, setCurrentPage, totalPages
  };
};