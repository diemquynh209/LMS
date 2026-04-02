import React, { useState } from 'react';
import { 
  IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonButton, 
  IonIcon, IonBadge, IonText, IonSpinner, IonToast,
  IonModal, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption
} from '@ionic/react';
import { listOutline, peopleOutline, addOutline, bookOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

import InstructorLayout from '../../components/InstructorLayout';
import { useInstructorClasses } from '../../hooks/instructor/useInstructorClasses'; 
import '../../theme/pages/InstructorClasses.css'; 

const InstructorClasses: React.FC = () => {
  const history = useHistory();
  const { 
    classes, categories, loading, error, toastMsg, setToastMsg, 
    createClass 
  } = useInstructorClasses();

  const [showModal, setShowModal] = useState(false);
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveClass = async () => {
    if (!className.trim()) {
      setToastMsg('Vui lòng nhập tên lớp học!');
      return;
    }
    
    setIsSubmitting(true);
    const success = await createClass(className, description, categoryId);
    if (success) {
      setShowModal(false);
      setClassName('');
      setDescription('');
      setCategoryId('');
    }
    setIsSubmitting(false);
  };

  return (
    <InstructorLayout pageTitle="Quản lý Lớp học">
      
      <div className="page-header-container">
        <h2 className="page-title">Lớp học của tôi</h2>
        <IonButton color="primary" className="btn-create-class" onClick={() => setShowModal(true)}>
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
                      <h3 className="course-title">{cls.class_name}</h3>
                      <div className="course-stats-container">
                        <IonIcon icon={peopleOutline} className="course-stats-icon" />
                        <IonText color="medium" className="course-stats-text">{cls.student_count} Học viên</IonText>
                      </div>
                    </IonCardContent>
                    <div className="course-actions-container">
                      <IonButton fill="clear" className="btn-glass-action" onClick={() => history.push(`/instructor/course-builder/${cls.class_id}`)}>
                        <IonIcon slot="start" icon={listOutline} /> Chương
                      </IonButton>
                      <IonButton fill="clear" className="btn-glass-action btn-orange" onClick={() => history.push(`/instructor/students/${cls.class_id}`)}>
                        <IonIcon slot="start" icon={peopleOutline} /> Học sinh
                      </IonButton>
                    </div>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </IonContent>
      )}
      
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} breakpoints={[0, 0.7, 0.9]} initialBreakpoint={0.7}>
        <IonHeader>
          <IonToolbar color="light">
            <IonTitle>Khởi tạo Lớp học mới</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          
          <IonItem className="modal-form-item">
            <IonLabel position="stacked">Tên lớp học <span className="required-asterisk">*</span></IonLabel>
            <IonInput value={className} onIonInput={e => setClassName(e.detail.value!)} placeholder="VD: Lập trình ReactJS cơ bản" />
          </IonItem>

          <IonItem className="modal-form-item">
            <IonLabel position="stacked">Danh mục môn học</IonLabel>
            <IonSelect value={categoryId} onIonChange={e => setCategoryId(e.detail.value)} placeholder="-- Chọn danh mục --" interface="popover">
              {categories.map((cat) => (
                <IonSelectOption key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem className="modal-form-item mb-20">
            <IonLabel position="stacked">Mô tả tóm tắt</IonLabel>
            <IonTextarea value={description} onIonInput={e => setDescription(e.detail.value!)} placeholder="Giới thiệu qua về lớp học này..." rows={4} />
          </IonItem>

          <div className="modal-btn-group">
            <IonButton expand="block" color="medium" fill="outline" className="modal-btn-flex" onClick={() => setShowModal(false)}>HỦY</IonButton>
            <IonButton expand="block" color="primary" className="modal-btn-flex" onClick={handleSaveClass} disabled={isSubmitting}>
              {isSubmitting ? <IonSpinner name="dots" /> : 'TẠO LỚP'}
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      <IonToast isOpen={!!toastMsg} message={toastMsg} duration={3000} onDidDismiss={() => setToastMsg('')} />
    </InstructorLayout>
  );
};

export default InstructorClasses;