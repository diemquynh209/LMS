import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { IonButton, IonIcon, IonInput, IonSpinner, IonToast } from '@ionic/react';
import { sendOutline, trashOutline, arrowDownCircleOutline, searchOutline } from 'ionicons/icons';
import { useAdminInstructors } from '../../hooks/useAdminInstructors';

const AdminInstructors: React.FC = () => {
  const {
    email, setEmail, toastMsg, setToastMsg, isLoading, instructors, fetchInstructors,
    handleSendInvite, handleRoleChange, handleDeleteUser
  } = useAdminInstructors();

  return (
    <AdminLayout pageTitle="Dashboard / Quản Lý Giảng Viên">
      <div style={{ padding: '20px', paddingBottom: '80px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <h2 style={{ margin: 0, fontWeight: 'bold' }}>Danh sách Giảng viên</h2>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'white', height: '45px', borderRadius: '8px', padding: '2px 15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0', flex: '1', maxWidth: '300px' }}>
              <IonIcon icon={searchOutline} style={{ color: '#888', marginRight: '8px', fontSize: '20px' }} />
              <IonInput placeholder="Tìm kiếm..." onIonInput={e => fetchInstructors(e.detail.value!)} style={{ '--padding-start': '0px' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', background: 'white', height: '45px', borderRadius: '8px', padding: '2px 10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0', flex: '1', maxWidth: '350px' }}>
              <IonInput placeholder="Nhập email mời..." value={email} onIonInput={e => setEmail(e.detail.value!)} style={{ '--padding-start': '10px' }} type="email" />
              <IonButton onClick={handleSendInvite} disabled={isLoading || !email.includes('@')} fill="clear" color="primary">
                {isLoading ? <IonSpinner name="dots" /> : <IonIcon slot="icon-only" icon={sendOutline} />}
              </IonButton>
            </div>
          </div>
        </div>
        
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ và Tên</th>
                <th>Lớp học phụ trách</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'center' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {instructors?.map((ins: any) => (
                <tr key={ins.user_id}>
                  <td>#{ins.user_id}</td>
                  <td style={{ fontWeight: 'bold' }}>{ins.full_name}</td>
                  
                  <td style={{ maxWidth: '250px' }}>
                    {ins.classes ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {ins.classes.split(',').map((className: string, index: number) => (
                          <span key={index} style={{
                            background: '#e3f2fd', color: '#1976d2', padding: '3px 8px', 
                            borderRadius: '12px', fontSize: '12px', border: '1px solid #bbdefb'
                          }}>
                            {className.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#999', fontStyle: 'italic' }}>Chưa có lớp</span>
                    )}
                  </td>

                  <td>{ins.email}</td>
                  <td>{ins.phone || 'Chưa cập nhật'}</td>
                  <td><span className="badge-active">Hoạt động</span></td>
                  <td>
                    <div className="action-td-container">
                      <IonButton className="action-btn" color="warning" fill="clear" onClick={() => handleRoleChange(ins.user_id, ins.full_name, 'Student')} title="Giáng cấp">
                        <IonIcon slot="icon-only" icon={arrowDownCircleOutline} />
                      </IonButton>
                      <IonButton className="action-btn" color="danger" fill="clear" onClick={() => handleDeleteUser(ins.user_id, ins.full_name)} title="Xóa">
                        <IonIcon slot="icon-only" icon={trashOutline} />
                      </IonButton>
                    </div>
                  </td>
                </tr>
              ))}
              {instructors?.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>Không tìm thấy giảng viên nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <IonToast isOpen={!!toastMsg} message={toastMsg} duration={3000} onDidDismiss={() => setToastMsg('')} />
    </AdminLayout>
  );
};

export default AdminInstructors;