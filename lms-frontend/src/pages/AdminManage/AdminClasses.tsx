import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { IonIcon, IonToast, IonInput } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { useAdminClasses } from '../../hooks/admin/useAdminClasses';
import ClassTable from '../../components/shared/ClassTable';

const AdminClasses: React.FC = () => {
  const {
    toastMsg, setToastMsg, classes, fetchClasses,
    handleDeleteClass, handleUpdateStatus 
  } = useAdminClasses();

  return (
    <AdminLayout pageTitle="Quản Lý Lớp Học">
      <div style={{ padding: '20px', paddingBottom: '80px' }}> 
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <h2 style={{ margin: 0, fontWeight: 'bold' }}>Danh sách Lớp học</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', background: 'white', height: '45px', borderRadius: '8px', padding: '2px 15px', border: '1px solid #e0e0e0', flex: '1', maxWidth: '350px' }}>
            <IonIcon icon={searchOutline} style={{ color: '#888', marginRight: '8px', fontSize: '20px' }} />
            <IonInput placeholder="Tìm kiếm tên lớp, giảng viên..." onIonInput={e => fetchClasses(e.detail.value!)} style={{ '--padding-start': '0px' }} />
          </div>
        </div>
        
        <ClassTable 
          classes={classes} 
          role="Admin" 
          onUpdateStatus={handleUpdateStatus} 
          onDelete={handleDeleteClass} 
        />
        
      </div>

      <IonToast isOpen={!!toastMsg} message={toastMsg} duration={3000} onDidDismiss={() => setToastMsg('')} />
    </AdminLayout>
  );
};

export default AdminClasses;