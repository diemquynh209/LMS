import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { IonButton, IonIcon, IonInput, IonSpinner, IonToast } from '@ionic/react';
import { sendOutline, trashOutline, arrowDownCircleOutline, searchOutline } from 'ionicons/icons';
import { useAdminInstructors } from '../../hooks/admin/useAdminInstructors';
import Pagination from '../../components/shared/Pagination';
import '../../theme/pages/AdminPages.css';

const AdminInstructors: React.FC = () => {
  const {
    email, setEmail, toastMsg, setToastMsg, isLoading, fetchInstructors,
    handleSendInvite, handleRoleChange, handleDeleteUser,
    currentInstructors, currentPage, setCurrentPage, totalPages
  } = useAdminInstructors();

  return (
    <AdminLayout pageTitle=" Quản Lý Giảng Viên">
      <div className="admin-page-container">
        
        <div className="admin-page-header">
          <h2 className="admin-page-title">Danh sách Giảng viên</h2>
          
          <div className="admin-actions-wrapper">
            <div className="admin-search-bar with-shadow">
              <IonIcon icon={searchOutline} className="admin-search-icon" />
              <IonInput placeholder="Tìm kiếm..." onIonInput={e => fetchInstructors(e.detail.value!)} className="admin-search-input" />
            </div>

            <div className="admin-input-bar">
              <IonInput placeholder="Nhập email mời..." value={email} onIonInput={e => setEmail(e.detail.value!)} className="admin-invite-input" type="email" />
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
              {currentInstructors?.map((ins: any) => (
                <tr key={ins.user_id}>
                  <td>#{ins.user_id}</td>
                  <td className="td-bold">{ins.full_name}</td>
                  
                  <td className="td-max-width-250">
                    {ins.classes ? (
                      <div className="badge-wrapper">
                        {ins.classes.split(',').map((className: string, index: number) => (
                          <span key={index} className="badge-tag badge-blue">
                            {className.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-empty-italic">Chưa có lớp</span>
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
              {currentInstructors?.length === 0 && (
                <tr><td colSpan={7} className="admin-table-empty">Không tìm thấy giảng viên nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>

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

export default AdminInstructors;