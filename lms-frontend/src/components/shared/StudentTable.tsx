import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { trashOutline, arrowUpCircleOutline, exitOutline } from 'ionicons/icons'; // Thêm exitOutline làm icon kick

interface StudentTableProps {
  students: any[];
  role: 'Admin' | 'Instructor';
  onRoleChange?: (userId: number, fullName: string, currentRole: string, newRole: string) => void;
  onDelete?: (userId: number, fullName: string) => void;
  onKick?: (userId: number, fullName: string) => void; 
}

const StudentTable: React.FC<StudentTableProps> = ({ students, role, onRoleChange, onDelete, onKick }) => {
  return (
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
                  {/* Dành riêng cho Admin */}
                  {role === 'Admin' && onRoleChange && onDelete && (
                    <>
                      <IonButton className="action-btn" color="success" fill="clear" onClick={() => onRoleChange(st.user_id, st.full_name, st.role, 'Instructor')} title="Nâng cấp">
                        <IonIcon slot="icon-only" icon={arrowUpCircleOutline} />
                      </IonButton>
                      <IonButton className="action-btn" color="danger" fill="clear" onClick={() => onDelete(st.user_id, st.full_name)} title="Xóa tài khoản">
                        <IonIcon slot="icon-only" icon={trashOutline} />
                      </IonButton>
                    </>
                  )}

                  {/*Dành riêng cho Instructor */}
                  {role === 'Instructor' && onKick && (
                    <IonButton className="action-btn" color="warning" fill="clear" onClick={() => onKick(st.user_id, st.full_name)} title="Kick khỏi lớp">
                      <IonIcon slot="icon-only" icon={exitOutline} />
                    </IonButton>
                  )}
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
  );
};

export default StudentTable;