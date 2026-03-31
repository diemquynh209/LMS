import React from 'react';
import { IonSpinner } from '@ionic/react';
import InstructorLayout from '../../components/InstructorLayout';
import StudentTable from '../../components/shared/StudentTable';
import { useInstructorStudents } from '../../hooks/instructor/useInstructorStudents';

const InstructorStudents: React.FC = () => {
  const { students, loading, error } = useInstructorStudents();

  return (
    <InstructorLayout pageTitle="Danh sách học viên">
      <div className="ion-padding">
        
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: '#2c3e50', fontWeight: 'bold', margin: 0 }}>
            Học viên của tôi
          </h2>
          <p style={{ color: '#7f8c8d', margin: '5px 0 0 0' }}>
            Quản lý và theo dõi thông tin các học viên đang tham gia lớp học của bạn.
          </p>
        </div>

        {error && (
          <div style={{ color: '#c62828', background: '#ffebee', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>
            {error}
          </div>
        )}
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <IonSpinner name="crescent" color="primary" />
            <p style={{ color: '#7f8c8d' }}>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <StudentTable 
            students={students} 
            role="Instructor" 
          />
        )}
      </div>
    </InstructorLayout>
  );
};

export default InstructorStudents;