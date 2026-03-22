import React from 'react';
import { IonButton, IonIcon, IonSelect, IonSelectOption } from '@ionic/react';
import { trashOutline, eyeOutline, peopleOutline } from 'ionicons/icons';

interface ClassTableProps {
  classes: any[];
  role: 'Admin' | 'Instructor'; // Nhận diện ai đang xem bảng
  onUpdateStatus?: (classId: number, status: string) => void;
  onDelete?: (classId: number, className: string) => void;
}

const ClassTable: React.FC<ClassTableProps> = ({ classes, role, onUpdateStatus, onDelete }) => {
  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Lớp Học</th>
            {/* Chỉ Admin mới cần xem cột giảng viên */}
            {role === 'Admin' && <th>Giảng viên</th>}
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
              
              {role === 'Admin' && <td>{cls.instructor_name || 'Chưa phân công'}</td>}
              
              <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#1976d2', fontSize: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <IonIcon icon={peopleOutline} style={{ fontSize: '18px', color: '#64b5f6' }} />
                  {cls.student_count || 0}
                </div>
              </td>

              <td style={{ textAlign: 'center' }}>
                {onUpdateStatus ? (
                  <div style={{ 
                    background: cls.status === 'Published' ? '#e8f5e9' : (cls.status === 'Closed' ? '#ffebee' : '#fff3e0'), 
                    borderRadius: '12px', display: 'inline-block', padding: '0px 10px' 
                  }}>
                    <IonSelect 
                        value={cls.status || 'Draft'} 
                        onIonChange={(e) => onUpdateStatus(cls.class_id, e.detail.value)} 
                        interface="popover" 
                        style={{ 
                          fontWeight: 'bold', 
                          fontSize: '13px',
                          color: cls.status === 'Published' ? '#2e7d32' : (cls.status === 'Closed' ? '#c62828' : '#e65100')
                        }}
>
                      <IonSelectOption value="Draft">Draft</IonSelectOption>
                      <IonSelectOption value="Published">Published</IonSelectOption>
                      <IonSelectOption value="Closed">Closed</IonSelectOption>
                    </IonSelect>
                  </div>
                ) : (
                  <span className="badge-active" style={{ 
                    background: cls.status === 'Published' ? '#e8f5e9' : (cls.status === 'Closed' ? '#ffebee' : '#fff3e0'), 
                    color: cls.status === 'Published' ? '#2e7d32' : (cls.status === 'Closed' ? '#c62828' : '#e65100') 
                  }}>
                    {cls.status || 'Draft'}
                  </span>
                )}
              </td>

              <td>
                <div className="action-td-container">
                  <IonButton className="action-btn" color="primary" fill="clear" title="Xem chi tiết lớp">
                    <IonIcon slot="icon-only" icon={eyeOutline} />
                  </IonButton>
                  
                  {/*Chỉ Admin mới hiện nút xóa */}
                  {role === 'Admin' && onDelete && (
                    <IonButton className="action-btn" color="danger" fill="clear" onClick={() => onDelete(cls.class_id, cls.class_name)} title="Xóa lớp học">
                      <IonIcon slot="icon-only" icon={trashOutline} />
                    </IonButton>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {classes?.length === 0 && (
            <tr>
              {/*tự động co giãn theo số lượng cột của từng role */}
              <td colSpan={role === 'Admin' ? 6 : 5} style={{ textAlign: 'center', padding: '30px' }}>
                Không tìm thấy lớp học nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClassTable;