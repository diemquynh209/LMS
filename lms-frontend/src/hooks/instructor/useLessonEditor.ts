import { useState, useEffect, useCallback } from 'react';

export const useLessonEditor = (lessonId: string) => {
  const [lessonName, setLessonName] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
 
  const [aiStatus, setAiStatus] = useState<'none' | 'processing' | 'pending_review' | 'published'>('none');
  const [aiSummary, setAiSummary] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Lấy dữ liệu bài học hiện tại
  const fetchLesson = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/instructor/lessons/${lessonId}`);
      if (response.ok) {
        const data = await response.json();
        setLessonName(data.lesson_name || '');
        setContent(data.content || '');
        setVideoUrl(data.video_url || '');
        setDocumentUrl(data.document_url || '');
        
        // Cập nhật dữ liệu AI từ DB
        setAiStatus(data.ai_status || 'none');
        setAiSummary(data.ai_summary || '');
      }
    } catch (error) {
      setToastMsg('Lỗi khi lấy dữ liệu bài học!');
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchLesson();
  }, [fetchLesson]);

  // Lưu các thông tin Text cơ bản
  const saveLessonInfo = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/instructor/lessons/${lessonId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson_name: lessonName, content, video_url: videoUrl, document_url: documentUrl })
      });
      if (response.ok) setToastMsg('Đã lưu thông tin bài học!');
      else setToastMsg('Lỗi khi lưu bài học!');
    } catch (error) {
      setToastMsg('Lỗi kết nối máy chủ!');
    }
  };

  // Upload file lên Cloudinary
  const uploadDocument = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('document', file); 

    try {
      const response = await fetch(`http://localhost:5000/api/instructor/lessons/${lessonId}/upload-document`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setDocumentUrl(data.document_url);
        
        // Ngay khi upload xong, đổi status sang processing để UI hiện trạng thái đang xử lý
        setAiStatus('processing');
        setToastMsg('Upload thành công! Hệ thống AI đang bắt đầu xử lý...');
      } else {
        setToastMsg(data.message || 'Lỗi upload!');
      }
    } catch (error) {
      setToastMsg('Lỗi kết nối khi upload file!');
    } finally {
      setUploading(false);
    }
  };

  const approveAISummary = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/instructor/lesson/${lessonId}/approve-summary`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finalSummary: aiSummary })
      });
      
      const data = await response.json();
      if (response.ok) {
        setAiStatus('published'); // Chuyển sang màu xanh
        setToastMsg(data.message || 'Đã duyệt tóm tắt thành công!');
      } else {
        setToastMsg(data.message || 'Có lỗi xảy ra khi duyệt!');
      }
    } catch (error) {
      setToastMsg('Lỗi kết nối khi duyệt bài!');
    }
  };

  return {
    lessonName, setLessonName, content, setContent, videoUrl, setVideoUrl, documentUrl,
    aiStatus, aiSummary, setAiSummary, approveAISummary, // Export thêm các state/function cho AI
    loading, uploading, toastMsg, setToastMsg,
    saveLessonInfo, uploadDocument
  };
};