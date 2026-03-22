import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { IonIcon, IonToast, IonInput } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { useAdminStudents } from '../../hooks/admin/useAdminStudents'; 
import StudentTable from '../../components/shared/StudentTable';

const AdminStudents: React.FC = () => {
  const {
    toastMsg, setToastMsg, students, fetchStudents,
    handleRoleChange, handleDeleteUser
  } = useAdminStudents();

  return (
    <AdminLayout pageTitle="Quản Lý Học Viên">
      <div style={{ padding: '20px', paddingBottom: '80px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <h2 style={{ margin: 0, fontWeight: 'bold' }}>Danh sách Học viên</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', background: 'white', height: '45px', borderRadius: '8px', padding: '2px 15px', border: '1px solid #e0e0e0', flex: '1', maxWidth: '350px' }}>
            <IonIcon icon={searchOutline} style={{ color: '#888', marginRight: '8px', fontSize: '20px' }} />
            <IonInput placeholder="Tìm kiếm tên, email, sđt..." onIonInput={e => fetchStudents(e.detail.value!)} style={{ '--padding-start': '0px' }} />
          </div>
        </div>
      
        <StudentTable 
          students={students} 
          role="Admin" 
          onRoleChange={handleRoleChange} 
          onDelete={handleDeleteUser} 
        />

      </div>
      <IonToast isOpen={!!toastMsg} message={toastMsg} duration={3000} onDidDismiss={() => setToastMsg('')} />
    </AdminLayout>
  );
};

export default AdminStudents;