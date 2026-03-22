import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { IonButton, IonIcon, IonToast, IonInput } from '@ionic/react';
import { trashOutline, arrowUpCircleOutline, searchOutline } from 'ionicons/icons';
import { useAdminStudents } from '../../hooks/useAdminStudents';

const AdminStudents: React.FC = () => {
  const {
    toastMsg, setToastMsg, students, fetchStudents,
    handleRoleChange, handleDeleteUser
  } = useAdminStudents();

  return (
    <AdminLayout pageTitle="Dashboard / Quản Lý Học Viên">
      <div style={{ padding: '20px', paddingBottom: '80px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <h2 style={{ margin: 0, fontWeight: 'bold' }}>Danh sách Học viên</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', background: 'white', height: '45px', borderRadius: '8px', padding: '2px 15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0', flex: '1', maxWidth: '350px' }}>
            <IonIcon icon={searchOutline} style={{ color: '#888', marginRight: '8px', fontSize: '20px' }} />
            <IonInput placeholder="Tìm kiếm tên, email, sđt..." onIonInput={e => fetchStudents(e.detail.value!)} style={{ '--padding-start': '0px' }} />
          </div>
        </div>
        
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ và Tên</th>
                <th>Các lớp đang học</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'center' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {students?.map((st) => (
                <tr key={st.user_id}>
                  <td>#{st.user_id}</td>
                  <td style={{ fontWeight: 'bold' }}>{st.full_name}</td>
                  
                  <td style={{ maxWidth: '250px' }}>
                    {st.classes ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {st.classes.split(',').map((className: string, index: number) => (
                          <span key={index} style={{
                            background: '#e8f5e9', color: '#2e7d32', padding: '3px 8px', 
                            borderRadius: '12px', fontSize: '12px', border: '1px solid #c8e6c9'
                          }}>
                            {className.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#999', fontStyle: 'italic' }}>Chưa đăng ký</span>
                    )}
                  </td>

                  <td>{st.email}</td>
                  <td>{st.phone || 'Chưa cập nhật'}</td>
                  <td><span className="badge-active">Hoạt động</span></td>
                  <td>
                    <div className="action-td-container">
                      <IonButton className="action-btn" color="success" fill="clear" onClick={() => handleRoleChange(st.user_id, st.full_name, st.role, 'Instructor')} title="Nâng cấp">
                        <IonIcon slot="icon-only" icon={arrowUpCircleOutline} />
                      </IonButton>
                      <IonButton className="action-btn" color="danger" fill="clear" onClick={() => handleDeleteUser(st.user_id, st.full_name)} title="Xóa">
                        <IonIcon slot="icon-only" icon={trashOutline} />
                      </IonButton>
                    </div>
                  </td>
                </tr>
              ))}
              {students?.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>Không tìm thấy học viên nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <IonToast isOpen={!!toastMsg} message={toastMsg} duration={3000} onDidDismiss={() => setToastMsg('')} />
    </AdminLayout>
  );
};

export default AdminStudents;