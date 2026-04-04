import { useState, useEffect, useCallback } from 'react';

export interface ClassItem {
  class_id: number;
  class_name: string;
  category_name?: string;
  category_id?: string;
  student_count: number;
  status: 'Draft' | 'Published' | 'Closed';
  created_at: string;
  description?: string;
  image_url?: string;
}

export const useInstructorClasses = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/instructor/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
    }
  }, []);

  const fetchClasses = useCallback(async (searchTerm: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const instructorId = userData.user_id || userData.id; 
      let url = `http://localhost:5000/api/instructor/classes?instructorId=${instructorId}`;
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      } else {
        setError('Không thể tải danh sách lớp học');
      }
    } catch (err) {
      setError('Lỗi kết nối đến máy chủ');
    } finally {
      setLoading(false);
    }
  }, []);

  const createClass = async (className: string, description: string, categoryId: string, imageFile: File | null) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const instructorId = userData.user_id || userData.id;
      const formData = new FormData();
      formData.append('instructorId', instructorId);
      formData.append('class_name', className);
      formData.append('description', description);
      if (categoryId) formData.append('category_id', categoryId);
      if (imageFile) formData.append('image', imageFile);

      const response = await fetch('http://localhost:5000/api/instructor/classes', {
        method: 'POST',
        body: formData 
      });

      if (response.ok) {
        setToastMsg('Tạo lớp học mới thành công!');
        fetchClasses(); 
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
  
  const updateClass = async (classId: number, className: string, description: string, categoryId: string, imageFile: File | null) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const instructorId = userData.user_id || userData.id;

      const formData = new FormData();
      formData.append('instructorId', instructorId);
      formData.append('class_name', className);
      formData.append('description', description);
      if (categoryId) formData.append('category_id', categoryId);
      if (imageFile) formData.append('image', imageFile);

      const response = await fetch(`http://localhost:5000/api/instructor/classes/${classId}`, {
        method: 'PUT',
        body: formData 
      });

      if (response.ok) {
        setToastMsg('Cập nhật lớp học thành công!');
        fetchClasses(); 
        return true;
      } else {
        const errorData = await response.json();
        setToastMsg(errorData.message || 'Lỗi cập nhật lớp!');
        return false;
      }
    } catch (error) {
      setToastMsg('Lỗi kết nối máy chủ!');
      return false;
    }
  };

  const deleteClass = async (classId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/instructor/classes/${classId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();

      if (response.ok) {
        setToastMsg('Đã xóa lớp học vĩnh viễn!');
        fetchClasses();
        return true;
      } else {
        setToastMsg(data.message || 'Lỗi khi xóa lớp học!');
        return false;
      }
    } catch (error) {
      setToastMsg('Lỗi kết nối máy chủ!');
      return false;
    }
  };

  const updateStatus = async (classId: number, newStatus: string) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const instructorId = userData.user_id || userData.id;

      const response = await fetch(`http://localhost:5000/api/instructor/classes/${classId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructorId, status: newStatus })
      });
      if (response.ok) {
        setToastMsg(`Đã đổi trạng thái thành ${newStatus === 'Published' ? 'Công khai' : newStatus === 'Closed' ? 'Đã đóng' : 'Bản nháp'}`);
        fetchClasses();
        return true;
      } else {
        const errorData = await response.json();
        setToastMsg(errorData.message || 'Lỗi cập nhật trạng thái!');
        return false;
      }
    } catch (error) {
      setToastMsg('Lỗi kết nối máy chủ!');
      return false;
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchCategories();
  }, [fetchClasses, fetchCategories]);

  return { 
    classes, categories, loading, error, toastMsg, setToastMsg,
    fetchClasses, createClass, updateClass, deleteClass, updateStatus
  };
};