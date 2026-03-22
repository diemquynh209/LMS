import React from 'react';

interface NotificationTableProps {
  notifications: any[];
}

const NotificationTable: React.FC<NotificationTableProps> = ({ notifications }) => {
  const translateRole = (role: string) => {
    if (role === 'All') return 'Tất cả';
    if (role === 'Student') return 'Học viên';
    if (role === 'Instructor') return 'Giảng viên';
    return role;
  };

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Nội dung</th>
            <th style={{ textAlign: 'center' }}>Loại</th>
            <th style={{ textAlign: 'center' }}>Đối tượng nhận</th>
            <th>Ngày gửi</th>
          </tr>
        </thead>
        <tbody>
          {notifications?.map((note: any) => (
            <tr key={note.notification_id}>
              <td>#{note.notification_id}</td>
              <td style={{ fontWeight: 'bold', color: '#2c3e50' }}>{note.title}</td>
              <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {note.message}
              </td>
              <td style={{ textAlign: 'center' }}>
                <span style={{ 
                  background: note.type === 'System' ? '#e3f2fd' : '#f3e5f5', 
                  color: note.type === 'System' ? '#1565c0' : '#7b1fa2', 
                  padding: '3px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold'
                }}>
                  {note.type}
                </span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '3px 8px', borderRadius: '12px', fontSize: '12px' }}>
                  {translateRole(note.target_role)}
                </span>
              </td>
              <td>{new Date(note.created_at).toLocaleString('vi-VN')}</td>
            </tr>
          ))}
          {notifications?.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '30px' }}>Chưa có thông báo nào.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationTable;