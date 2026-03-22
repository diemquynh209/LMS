import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const dict = {
  vi: {
    sidebarTitle: "Administrator",
    menu: { dashboard: "Quản lý chung", students: "Quản lý học sinh", instructors: "Quản lý giảng viên", classes: "Quản lý lớp học", categories: "Quản lý danh mục", notifications: "Quản lý thông báo" },
    cards: { students: "Tổng số học viên", instructors: "Tổng số giảng viên", classes: "Tổng số lớp học", reports: "Tổng số report" },
    status: { active: "Hoạt động", pending: "Chờ xử lý" },
    charts: { classStatus: "Trạng thái lớp học (Draft vs Published)", topClasses: "Top 5 lớp học đăng ký nhiều nhất" }
  },
  en: {
    sidebarTitle: "Administrator",
    menu: { dashboard: "Dashboard", students: "Manage Students", instructors: "Manage Instructors", classes: "Manage Classes", categories: "Manage Categories", notifications: "Notifications" },
    cards: { students: "Total Students", instructors: "Total Instructors", classes: "Total Classes", reports: "Total Reports" },
    status: { active: "Active", pending: "Pending" },
    charts: { classStatus: "Class Status (Draft vs Published)", topClasses: "Top 5 Most Enrolled Classes" }
  }
};

export const useAdminDashboard = () => {
  const history = useHistory();
  const location = useLocation();
  
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const t = dict[lang];

  const [stats, setStats] = useState({
    totalStudents: 0, 
    totalInstructors: 0, 
    totalClasses: 0, 
    pendingReports: 0, 
    pieChartData: [],
    topClasses: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/dashboard-stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    history.replace('/login');
  };

  return {
    t,
    lang,
    setLang,
    stats,
    handleLogout,
    location,
    history
  };
};