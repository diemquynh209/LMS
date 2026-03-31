import React from 'react';
import { 
  IonContent, IonGrid, IonRow, IonCol, 
  IonCard, IonCardContent, IonButton, IonIcon, 
  IonBadge, IonText, IonSpinner
} from '@ionic/react';
import { listOutline, peopleOutline, addOutline, bookOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

import InstructorLayout from '../../components/InstructorLayout';
import { useInstructorClasses } from '../../hooks/instructor/useInstructorClasses'; 

import '../../theme/pages/InstructorClasses.css'; 

const InstructorClasses: React.FC = () => {
  const history = useHistory();
  const { classes, loading, error } = useInstructorClasses();

  return (
    <InstructorLayout pageTitle="Quản lý Lớp học">
      
      <div className="page-header-container">
        <h2 className="page-title">Lớp học của tôi</h2>
        <IonButton color="primary" className="btn-create-class">
          <IonIcon slot="start" icon={addOutline} />
          Tạo lớp mới
        </IonButton>
      </div>

      {loading ? (
        <div className="empty-state-container">
          <IonSpinner name="crescent" color="primary" />
          <p>Đang tải danh sách lớp...</p>
        </div>
      ) : error ? (
        <div className="empty-state-container error-state">
          <p>Lỗi: {error}</p>
        </div>
      ) : classes && classes.length === 0 ? (
        <div className="empty-state-container">
          <IonIcon icon={bookOutline} className="empty-state-icon" />
          <p>Bạn chưa được phân công giảng dạy lớp nào.</p>
        </div>
      ) : (
        <IonContent className="transparent-content">
          <IonGrid className="course-grid">
            <IonRow>
              {classes.map((cls) => (
                <IonCol size="12" sizeMd="6" sizeLg="4" key={cls.class_id} className="course-col">

                  <IonCard className="course-card">

                    <div className="course-gradient-header">
                      <IonIcon icon={bookOutline} className="course-header-icon" />
                      <IonBadge className="course-badge">
                        {cls.status === 'Published' ? 'Đang mở' : 'Bản nháp'}
                      </IonBadge>
                    </div>

                    <IonCardContent className="course-content-pad">
                      <IonText color="primary" className="course-category-text">
                        {cls.category_name || 'Khóa học chung'}
                      </IonText>
                      
                      <h3 className="course-title">
                        {cls.class_name}
                      </h3>

                      <div className="course-stats-container">
                        <IonIcon icon={peopleOutline} className="course-stats-icon" />
                        <IonText color="medium" className="course-stats-text">
                          {cls.student_count} Học viên
                        </IonText>
                      </div>
                    </IonCardContent>

                    <div className="course-actions-container">
                      <IonButton 
                        fill="clear" 
                        className="btn-glass-action"
                        onClick={() => history.push(`/instructor/course-builder/${cls.class_id}`)}
                      >
                        <IonIcon slot="start" icon={listOutline} />
                        Chương
                      </IonButton>

                      <IonButton 
                        fill="clear" 
                        className="btn-glass-action btn-orange"
                        onClick={() => history.push(`/instructor/students/${cls.class_id}`)}
                      >
                        <IonIcon slot="start" icon={peopleOutline} />
                        Học sinh
                      </IonButton>
                    </div>

                  </IonCard>

                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </IonContent>
      )}
    </InstructorLayout>
  );
};

export default InstructorClasses;