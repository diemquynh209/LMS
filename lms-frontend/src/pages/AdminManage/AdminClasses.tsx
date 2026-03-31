import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { IonIcon, IonToast, IonInput } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { useAdminClasses } from '../../hooks/admin/useAdminClasses';
import ClassTable from '../../components/shared/ClassTable';
import Pagination from '../../components/shared/Pagination';
import '../../theme/pages/AdminPages.css';

const AdminClasses: React.FC = () => {
  const {
    toastMsg, setToastMsg, fetchClasses,
    handleDeleteClass, handleUpdateStatus,
    currentClasses, currentPage, setCurrentPage, totalPages
  } = useAdminClasses();

  return (
    <AdminLayout pageTitle="Quản Lý Lớp Học">
      <div className="admin-page-container"> 
        
        <div className="admin-page-header">
          <h2 className="admin-page-title">Danh sách Lớp học</h2>
          
          <div className="admin-search-bar">
            <IonIcon icon={searchOutline} className="admin-search-icon" />
            <IonInput placeholder="Tìm kiếm tên lớp, giảng viên..." onIonInput={e => fetchClasses(e.detail.value!)} className="admin-search-input" />
          </div>
        </div>
        
        <ClassTable 
          classes={currentClasses} 
          role="Admin" 
          onUpdateStatus={handleUpdateStatus} 
          onDelete={handleDeleteClass} 
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

export default AdminClasses;