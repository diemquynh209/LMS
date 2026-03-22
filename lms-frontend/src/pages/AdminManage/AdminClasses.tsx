import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { IonButton, IonIcon, IonToast, IonInput, IonSelect, IonSelectOption } from '@ionic/react';
import { trashOutline, searchOutline, eyeOutline, peopleOutline } from 'ionicons/icons';
import { useAdminClasses } from '../../hooks/useAdminClasses';

const AdminClasses: React.FC = () => {
  const {
    toastMsg, setToastMsg, classes, fetchClasses,
    handleDeleteClass, handleUpdateStatus 
  } = useAdminClasses();

  return (
    <AdminLayout pageTitle="Dashboard / Quản Lý Lớp Học">
      <div style={{ padding: '20px', paddingBottom: '80px' }}> 
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <h2 style={{ margin: 0, fontWeight: 'bold' }}>Danh sách Lớp học</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', background: 'white', height: '45px', borderRadius: '8px', padding: '2px 15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0', flex: '1', maxWidth: '350px' }}>
            <IonIcon icon={searchOutline} style={{ color: '#888', marginRight: '8px', fontSize: '20px' }} />
            <IonInput placeholder="Tìm kiếm tên lớp, giảng viên..." onIonInput={e => fetchClasses(e.detail.value!)} style={{ '--padding-start': '0px' }} />
          </div>
        </div>
        
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Lớp Học</th>
                <th>Giảng viên</th>
                <th style={{ textAlign: 'center' }}>Số học viên</th>
                <th style={{ textAlign: 'center' }}>Trạng thái</th>
                <th style={{ textAlign: 'center' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {classes?.map((cls) => (
                <tr key={cls.class_id}>
                  <td>#{cls.class_id}</td>
                  <td style={{ fontWeight: 'bold', color: '#2c3e50' }}>{cls.class_name}</td>
                  <td>{cls.instructor_name || 'Chưa phân công'}</td> 
                  
                  <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#1976d2', fontSize: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <IonIcon icon={peopleOutline} style={{ fontSize: '18px', color: '#64b5f6' }} />
                      {cls.student_count || 0}
                    </div>
                  </td>

                  {/* KHU VỰC THAY ĐỔI TRẠNG THÁI */}
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ 
                        background: cls.status === 'Published' ? '#e8f5e9' : (cls.status === 'Closed' ? '#ffebee' : '#fff3e0'),
                        borderRadius: '12px',
                        display: 'inline-block',
                        padding: '0px 10px',
                        border: `1px solid ${cls.status === 'Published' ? '#c8e6c9' : (cls.status === 'Closed' ? '#ffcdd2' : '#ffe0b2')}`
                    }}>
                      <IonSelect 
                        value={cls.status || 'Draft'}
                        onIonChange={(e) => handleUpdateStatus(cls.class_id, e.detail.value)}
                        interface="popover"
                        style={{
                          color: cls.status === 'Published' ? '#2e7d32' : (cls.status === 'Closed' ? '#c62828' : '#e65100'),
                          fontWeight: 'bold',
                          fontSize: '13px',
                          minHeight: '30px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <IonSelectOption value="Draft">Draft</IonSelectOption>
                        <IonSelectOption value="Published">Published</IonSelectOption>
                        <IonSelectOption value="Closed">Closed</IonSelectOption>
                      </IonSelect>
                    </div>
                  </td>

                  <td>
                    <div className="action-td-container">
                      <IonButton className="action-btn" color="primary" fill="clear" title="Xem chi tiết lớp">
                        <IonIcon slot="icon-only" icon={eyeOutline} />
                      </IonButton>
                      <IonButton className="action-btn" color="danger" fill="clear" onClick={() => handleDeleteClass(cls.class_id, cls.class_name)} title="Xóa lớp học">
                        <IonIcon slot="icon-only" icon={trashOutline} />
                      </IonButton>
                    </div>
                  </td>
                </tr>
              ))}
              
              {classes?.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '30px' }}>Không tìm thấy lớp học nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <IonToast isOpen={!!toastMsg} message={toastMsg} duration={3000} onDidDismiss={() => setToastMsg('')} />
    </AdminLayout>
  );
};

export default AdminClasses;