import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { trashOutline, arrowUpCircleOutline } from 'ionicons/icons';

interface StudentTableProps {
  students: any[];
  role: 'Admin' | 'Instructor';
  onRoleChange?: (userId: number, fullName: string, currentRole: string, newRole: string) => void;
  onDelete?: (userId: number, fullName: string) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({ students, role, onRoleChange, onDelete }) => {
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
            {/* Chỉ Admin mới Nâng cấp/Xóa */}
            {role === 'Admin' && <th style={{ textAlign: 'center' }}>Hành động</th>}
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
              
              {/* Chỉ hiển thị nút nếu là Admin */}
              {role === 'Admin' && onRoleChange && onDelete && (
                <td>
                  <div className="action-td-container">
                    <IonButton className="action-btn" color="success" fill="clear" onClick={() => onRoleChange(st.user_id, st.full_name, st.role, 'Instructor')} title="Nâng cấp">
                      <IonIcon slot="icon-only" icon={arrowUpCircleOutline} />
                    </IonButton>
                    <IonButton className="action-btn" color="danger" fill="clear" onClick={() => onDelete(st.user_id, st.full_name)} title="Xóa">
                      <IonIcon slot="icon-only" icon={trashOutline} />
                    </IonButton>
                  </div>
                </td>
              )}
            </tr>
          ))}
          {students?.length === 0 && (
            <tr><td colSpan={role === 'Admin' ? 7 : 6} style={{ textAlign: 'center', padding: '30px' }}>Không tìm thấy học viên nào.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;