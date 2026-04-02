import { useState, useEffect, useCallback } from 'react';

export interface ClassItem {
  class_id: number;
  class_name: string;
  category_name?: string;
  student_count: number;
  status: 'Draft' | 'Published' | 'Closed';
  created_at: string;
  description?: string;
}

export const useInstructorClasses = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]); // Thêm state chứa danh mục
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState(''); // Thêm thông báo Toast
  const fetchClasses = useCallback(async (searchTerm: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const instructorId = userData.user_id || userData.id || (userData.user && userData.user.user_id);

      if (!instructorId) throw new Error("Không tìm thấy thông tin giảng viên.");
      const response = await fetch(`http://localhost:5000/api/instructor/classes?instructorId=${instructorId}&search=${searchTerm}`);
      if (!response.ok) throw new Error("Lỗi khi tải dữ liệu lớp học");

      const data = await response.json();
      setClasses(data);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }, []);
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/instructor/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  }, []);

  const createClass = async (className: string, description: string, categoryId: string) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const instructorId = userData.user_id || userData.id;

      const response = await fetch('http://localhost:5000/api/instructor/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          instructorId, 
          class_name: className, 
          description, 
          category_id: categoryId || null 
        })
      });

      if (response.ok) {
        setToastMsg('Tạo lớp học mới thành công!');
        fetchClasses(); // Tải lại danh sách ngay lập tức
        return true;
      } else {
        const errorData = await response.json();
        setToastMsg(errorData.message || 'Lỗi khi tạo lớp!');
        return false;
      }
    } catch (error) {
      setToastMsg('Lỗi kết nối máy chủ!');
      return false;
    }
  };

  const updateStatus = async (classId: number, newStatus: string) => {
  };

  useEffect(() => {
    fetchClasses();
    fetchCategories(); // Gọi hàm lấy danh mục khi vừa vào trang
  }, [fetchClasses, fetchCategories]);

  return { 
    classes, categories, loading, error, toastMsg, setToastMsg, // Trả thêm biến ra ngoài
    fetchClasses, updateStatus, createClass
  };
};