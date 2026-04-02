import { useState, useCallback, useEffect } from 'react';

//Định nghĩa cấu trúc dữ liệu theo cây Lớp -> Chương -> Bài
export interface Lesson {
  lesson_id: number;
  chapter_id: number;
  lesson_name: string;
  order_index: number;
}

export interface Chapter {
  chapter_id: number;
  class_id: number;
  chapter_name: string;
  order_index: number;
  lessons: Lesson[];
}

export const useCourseBuilder = (classId: string) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

    //Lấy data chương trình học

  const fetchCurriculum = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/instructor/classes/${classId}/curriculum`);
      if (response.ok) {
        const data = await response.json();
        setChapters(data);
      } else {
        setToastMsg('Lỗi khi tải dữ liệu chương trình học');
      }
    } catch (error) {
      setToastMsg('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  }, [classId]);

  //CHAPTER

  const createChapter = async (chapterName: string) => {
    try {

      const nextOrderIndex = chapters.length;
      const response = await fetch('http://localhost:5000/api/instructor/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ class_id: classId, chapter_name: chapterName, order_index: nextOrderIndex })
      });
      if (response.ok) {
        setToastMsg('Thêm chương thành công!');
        fetchCurriculum();
        return true;
      }
      return false;
    } catch (error) {
      setToastMsg('Lỗi kết nối khi tạo chương');
      return false;
    }
  };

  const updateChapter = async (chapterId: number, newName: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/instructor/chapters/${chapterId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter_name: newName })
      });
      if (response.ok) {
        setToastMsg('Đổi tên chương thành công!');
        fetchCurriculum();
        return true;
      }
      return false;
    } catch (error) {
      setToastMsg('Lỗi khi sửa chương');
      return false;
    }
  };

  const deleteChapter = async (chapterId: number, chapterName: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa toàn bộ chương "${chapterName}"? Tất cả bài học bên trong cũng sẽ biến mất!`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/instructor/chapters/${chapterId}`, { method: 'DELETE' });
        if (response.ok) {
          setToastMsg('Đã xóa chương!');
          fetchCurriculum();
        }
      } catch (error) {
        setToastMsg('Lỗi khi xóa chương');
      }
    }
  };

  //Cập nhật thứ tự chương sau khi kéo thả
  const reorderChaptersAPI = async (newChapters: Chapter[]) => {
    setChapters(newChapters); 
    
    //Tạo mảng chỉ chứa id và thứ tự mới để gửi lên server
    const chaptersData = newChapters.map((c, index) => ({
      chapter_id: c.chapter_id,
      order_index: index 
    }));

    try {
      await fetch('http://localhost:5000/api/instructor/chapters/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapters: chaptersData })
      });
    } catch (error) {
      setToastMsg('Lỗi khi lưu thứ tự chương. Đang khôi phục lại...');
      fetchCurriculum();
    }
  };

  //LESSON

  const createLesson = async (chapterId: number, lessonName: string) => {
    try {
      // Tìm chương đó để xem nó đang có bao nhiêu bài học, từ đó set order_index cho bài mới
      const targetChapter = chapters.find(c => c.chapter_id === chapterId);
      const nextOrderIndex = targetChapter ? targetChapter.lessons.length : 0;

      const response = await fetch('http://localhost:5000/api/instructor/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter_id: chapterId, lesson_name: lessonName, order_index: nextOrderIndex })
      });
      if (response.ok) {
        setToastMsg('Thêm bài học thành công!');
        fetchCurriculum();
        return true;
      }
      return false;
    } catch (error) {
      setToastMsg('Lỗi khi thêm bài học');
      return false;
    }
  };

  const deleteLesson = async (lessonId: number, lessonName: string) => {
    if (window.confirm(`Xóa bài học "${lessonName}"?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/instructor/lessons/${lessonId}`, { method: 'DELETE' });
        if (response.ok) {
          setToastMsg('Đã xóa bài học!');
          fetchCurriculum();
        }
      } catch (error) {
        setToastMsg('Lỗi khi xóa bài học');
      }
    }
  };

  // Update thứ tự ( kéo thả từ chương này sang chương khác)
  const reorderLessonsAPI = async (newChapters: Chapter[]) => {
    setChapters(newChapters);
    
    //Trích xuất toàn bộ bài học thành 1 mảng
    let lessonsData: any[] = [];
    newChapters.forEach(chapter => {
      chapter.lessons.forEach((lesson, index) => {
        lessonsData.push({
          lesson_id: lesson.lesson_id,
          chapter_id: chapter.chapter_id,
          order_index: index
        });
      });
    });

    try {
      await fetch('http://localhost:5000/api/instructor/lessons/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessons: lessonsData })
      });
    } catch (error) {
      setToastMsg('Lỗi khi lưu thứ tự bài học. Đang khôi phục lại...');
      fetchCurriculum();
    }
  };

useEffect(() => {
    if (classId) {
      fetchCurriculum();
    }
  }, [fetchCurriculum, classId]);

  return {
    chapters, setChapters, loading, toastMsg, setToastMsg,
    fetchCurriculum,
    createChapter, updateChapter, deleteChapter, reorderChaptersAPI,
    createLesson, deleteLesson, reorderLessonsAPI
  };
};