import { useState, useEffect, useCallback } from 'react';

export interface StudentItem {
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  classes?: string;
  class_id?: number;
  status?: string;
  date_of_birth?: string;
}

export const useInstructorStudents = (classId?: string) => {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const instructorId = userData.user_id || userData.id; 

      if (!instructorId) {
        throw new Error("Không tìm thấy thông tin giảng viên. Vui lòng đăng nhập lại.");
      }

      let url = `http://localhost:5000/api/instructor/students?instructorId=${instructorId}`;
      if (classId) {
        url += `&classId=${classId}`; 
      }
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Lỗi khi tải dữ liệu học viên từ máy chủ.");
      }

      const data = await response.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi lấy danh sách học viên.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  const kickStudentFromClass = async (targetClassId: number, studentId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/instructor/classes/${targetClassId}/students/${studentId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setStudents(prev => prev.filter(st => st.user_id !== studentId));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Lỗi khi kick học viên:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { 
    students, 
    loading, 
    error, 
    fetchStudents, 
    kickStudentFromClass 
  };
};