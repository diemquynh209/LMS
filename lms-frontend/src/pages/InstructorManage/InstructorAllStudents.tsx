import React, { useState, useMemo } from 'react';
import { IonSpinner, IonButton, IonIcon } from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons'; 
import InstructorLayout from '../../components/InstructorLayout';
import Pagination from '../../components/shared/Pagination'; 
import { useInstructorStudents } from '../../hooks/instructor/useInstructorStudents';
import '../../theme/pages/InstructorStudent.css'; 
import '../../theme/shared/table.css'; 

const formatDOB = (dob?: string) => {
  if (!dob) return <span style={{ color: '#999', fontStyle: 'italic' }}>Chưa cập nhật</span>;
  return new Date(dob).toLocaleDateString('vi-VN');
};

const InstructorAllStudents: React.FC = () => {
  const { students, loading, error } = useInstructorStudents(); 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil((students?.length || 0) / itemsPerPage);

  const currentStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return students?.slice(startIndex, endIndex) || [];
  }, [students, currentPage]);

  return (
    <InstructorLayout pageTitle="Quản lý Học viên Tổng hợp">
      <div className="ion-padding">

        {error && <div className="student-error-banner">{error}</div>}
        
        {loading ? (
          <div className="student-loading-container">
            <IonSpinner name="crescent" color="primary" />
            <p className="student-loading-text">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Họ và Tên</th>
                    <th>Ngày sinh</th> {/* <--- THÊM CỘT NGÀY SINH */}
                    <th>Các lớp đang tham gia</th>
                    <th style={{ textAlign: 'center' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents?.map((st) => (
                    <tr key={st.user_id}>
                      <td>#{st.user_id}</td>
                      <td style={{ fontWeight: 'bold' }}>{st.full_name}</td>
                      <td>{formatDOB(st.date_of_birth)}</td> {/* <--- HIỂN THỊ NGÀY SINH */}
                      
                      <td style={{ maxWidth: '300px' }}>
                        {st.classes ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {st.classes.split(',').map((className: string, index: number) => (
                              <span key={index} style={{
                                background: '#e8f5e9', color: '#2e7d32', 
                                padding: '4px 10px', borderRadius: '12px', 
                                fontSize: '13px', border: '1px solid #c8e6c9', whiteSpace: 'nowrap'
                              }}>
                                {className.trim()}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: '#999', fontStyle: 'italic' }}>Chưa có lớp</span>
                        )}
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <div className="action-td-container" style={{ justifyContent: 'center' }}>
                          <IonButton className="action-btn" color="primary" fill="clear" title="Xem hồ sơ">
                            <IonIcon slot="icon-only" icon={personCircleOutline} />
                          </IonButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentStudents?.length === 0 && (
                    <tr><td colSpan={5} className="empty-table-cell">Chưa có học viên nào.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={(page) => setCurrentPage(page)} 
              />
            )}
          </>
        )}
      </div>
    </InstructorLayout>
  );
};

export default InstructorAllStudents;