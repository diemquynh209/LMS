import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { IonIcon, IonToast, IonInput } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { useAdminStudents } from '../../hooks/admin/useAdminStudents'; 
import StudentTable from '../../components/shared/StudentTable';
import Pagination from '../../components/shared/Pagination';
import '../../theme/pages/AdminPages.css';

const AdminStudents: React.FC = () => {
  const {
    toastMsg, setToastMsg, fetchStudents,
    handleRoleChange, handleToggleStatus, // Dùng hàm mới
    currentStudents, currentPage, setCurrentPage, totalPages
  } = useAdminStudents();

  return (
    <AdminLayout pageTitle="Quản Lý Học Viên">
      <div className="admin-page-container">
        
        <div className="admin-page-header">
          <h2 className="admin-page-title">Danh sách Học viên</h2>
          
          <div className="admin-search-bar">
            <IonIcon icon={searchOutline} className="admin-search-icon" />
            <IonInput placeholder="Tìm kiếm tên, email, sđt..." onIonInput={e => fetchStudents(e.detail.value!)} className="admin-search-input" />
          </div>
        </div>
      
        {/* Truyền hàm mới vào Table */}
        <StudentTable 
          students={currentStudents} 
          role="Admin" 
          onRoleChange={handleRoleChange} 
          onToggleStatus={handleToggleStatus} 
        />

        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={(page) => setCurrentPage(page)} 
        />
      </div>
      <IonToast isOpen={!!toastMsg} message={toastMsg} duration={3000} onDidDismiss={() => setToastMsg('')} />
    </AdminLayout>
  );
};

export default AdminStudents;