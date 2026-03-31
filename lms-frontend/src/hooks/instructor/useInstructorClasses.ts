import { useState, useEffect, useCallback } from 'react';

export interface ClassItem {
  class_id: number;
  class_name: string;
  category_name?: string;
  student_count: number;
  status: 'Draft' | 'Published' | 'Closed';
  created_at: string;
}

export const useInstructorClasses = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async (searchTerm: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const instructorId = userData.user_id || userData.id || (userData.user && userData.user.user_id);

      if (!instructorId) {
        console.log("Dữ liệu LocalStorage đang có:", userData);
        throw new Error("Không tìm thấy thông tin giảng viên.");
      }
      const response = await fetch(`http://localhost:5000/api/instructor/classes?instructorId=${instructorId}&search=${searchTerm}`);
      
      if (!response.ok) {
        throw new Error("Lỗi khi tải dữ liệu lớp học");
      }

      const data = await response.json();
      setClasses(data);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = async (classId: number, newStatus: string) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`http://localhost:5000/api/instructor/classes/${classId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          instructorId: userData.user_id, 
          status: newStatus 
        })
      });

      if (response.ok) {
        setClasses(prev => prev.map(c => c.class_id === classId ? { ...c, status: newStatus as any } : c));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return { 
    classes, 
    loading, 
    error, 
    fetchClasses,
    updateStatus
  };
};