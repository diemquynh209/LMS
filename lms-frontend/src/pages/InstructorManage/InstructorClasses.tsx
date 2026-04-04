import React, { useState, useRef, useEffect } from 'react';
import { 
  IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonButton, 
  IonIcon, IonBadge, IonText, IonSpinner, IonToast,
  IonModal, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption,
  useIonAlert, IonButtons
} from '@ionic/react';
import { 
  listOutline, peopleOutline, addOutline, bookOutline, 
  createOutline, trashOutline, imageOutline, checkmarkCircleOutline, closeOutline 
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

import InstructorLayout from '../../components/InstructorLayout';
import { useInstructorClasses, ClassItem } from '../../hooks/instructor/useInstructorClasses'; 
import '../../theme/pages/InstructorClasses.css'; 

const InstructorClasses: React.FC = () => {
  const history = useHistory();
  const { 
    classes, categories, loading, error, toastMsg, setToastMsg, 
    createClass, updateClass, deleteClass, updateStatus
  } = useInstructorClasses();

  const [presentAlert] = useIonAlert();

  // --- LẤY TÊN GIẢNG VIÊN TỪ LOCAL STORAGE ---
  const [userName, setUserName] = useState('');
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setUserName(userObj.full_name || '');
      } catch (e) {
        console.error("Lỗi đọc thông tin user", e);
      }
    }
  }, []);

  //state tạo mới
  const [showModal, setShowModal] = useState(false);
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  //state chỉnh sửa
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Partial<ClassItem> | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveClass = async () => {
    if (!className.trim()) {
      setToastMsg('Vui lòng nhập tên lớp học!');
      return;
    }
    
    setIsSubmitting(true);
    const success = await createClass(className, description, categoryId, imageFile);
    
    if (success) {
      setShowModal(false);
      setClassName('');
      setDescription('');
      setCategoryId('');
      setImageFile(null);
      setPreviewUrl('');  
    }
    setIsSubmitting(false);
  };

  const openEditModal = (cls: ClassItem) => {
    setEditingClass({ ...cls });
    setEditPreviewUrl(cls.image_url || '');
    setEditImageFile(null);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingClass(null);
  };

  const handleEditChange = (field: string, value: any) => {
    if (editingClass) {
      setEditingClass({ ...editingClass, [field]: value });
    }
  };

  const triggerEditImageSelect = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      setEditPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateClass = async () => {
    if (!editingClass?.class_name?.trim()) {
      setToastMsg('Tên lớp không được để trống!');
      return;
    }
    setIsSubmitting(true);
    const success = await updateClass(
      editingClass.class_id!, 
      editingClass.class_name, 
      editingClass.description || '', 
      editingClass.category_id || '', 
      editImageFile
    );
    if (success) closeEditModal();
    setIsSubmitting(false);
  };

  // Cảnh báo Xóa cứng
  const confirmDeleteClass = () => {
    presentAlert({
      header: 'Xác nhận xóa vĩnh viễn',
      message: 'Lớp học này là bản nháp và chưa có ai học. Bạn có chắc chắn muốn xóa sạch dữ liệu của lớp này?',
      buttons: [
        { text: 'Hủy', role: 'cancel' },
        { 
          text: 'Xóa vĩnh viễn', 
          role: 'destructive',
          handler: async () => {
            if (editingClass?.class_id) {
              const success = await deleteClass(editingClass.class_id);
              if (success) closeEditModal();
            }
          } 
        }
      ]
    });
  };

  // Cảnh báo Đóng lớp mềm
  const confirmCloseClass = () => {
    presentAlert({
      header: 'Xác nhận đóng lớp',
      message: 'Khi đóng lớp, học sinh mới sẽ không thể đăng ký, nhưng học sinh cũ vẫn giữ được lịch sử học tập. Bạn có chắc chắn?',
      buttons: [
        { text: 'Hủy', role: 'cancel' },
        { 
          text: 'Đóng lớp', 
          role: 'destructive',
          handler: async () => {
            if (editingClass?.class_id) {
              const success = await updateStatus(editingClass.class_id, 'Closed');
              if (success) closeEditModal();
            }
          } 
        }
      ]
    });
  };

  const handlePublishClass = async () => {
    if (editingClass?.class_id) {
      setIsSubmitting(true);
      // Gọi API cập nhật trạng thái thành 'Published'
      const success = await updateStatus(editingClass.class_id, 'Published');
      if (success) closeEditModal();
      setIsSubmitting(false);
    }
  };

  return (
    <InstructorLayout pageTitle="Quản lý Lớp học">
      
      <div className="page-header-container">
        <h2 className="page-title">Lớp học của {userName || 'tôi'}</h2>
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
                    
                    <div 
                      className="course-gradient-header"
                      style={cls.image_url ? { backgroundImage: `url(${cls.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                    >
                      {!cls.image_url && <IonIcon icon={bookOutline} className="course-header-icon" />}
                      
                      <IonBadge className="course-badge" color={cls.status === 'Published' ? 'success' : cls.status === 'Closed' ? 'medium' : 'warning'}>
                        {cls.status === 'Published' ? 'Công khai' : cls.status === 'Closed' ? 'Đã đóng' : 'Bản nháp'}
                      </IonBadge>
                    </div>

                    <IonCardContent className="course-content-pad">
                      <IonButton fill="clear" className="btn-edit-course" onClick={() => openEditModal(cls)}>
                        <IonIcon icon={createOutline} />
                      </IonButton>

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
                      
                      {/* ĐÃ CẬP NHẬT: TRUYỀN THÊM TÊN LỚP VÀO ROUTER STATE */}
                      <IonButton fill="clear" className="btn-glass-action btn-orange" onClick={() => history.push({
                        pathname: `/instructor/students/${cls.class_id}`,
                        state: { className: cls.class_name }
                      })}>
                        <IonIcon slot="start" icon={peopleOutline} /> Học sinh
                      </IonButton>
                    </div>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>

          {/*MODAL CHỈNH SỬA LỚP HỌC*/}
          <IonModal isOpen={isEditModalOpen} onDidDismiss={closeEditModal} breakpoints={[0, 0.95, 1]} initialBreakpoint={0.95}>
            <IonHeader>
              <IonToolbar color="light">
                <IonTitle>Chỉnh sửa Lớp học</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={closeEditModal}>
                    <IonIcon icon={closeOutline} />
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <IonItem className="modal-form-item">
                <IonLabel position="stacked">Tên lớp học <span className="required-asterisk">*</span></IonLabel>
                <IonInput value={editingClass?.class_name} onIonInput={e => handleEditChange('class_name', e.detail.value!)} />
              </IonItem>

              <IonItem className="modal-form-item">
                <IonLabel position="stacked">Danh mục môn học</IonLabel>
                <IonSelect value={editingClass?.category_id} onIonChange={e => handleEditChange('category_id', e.detail.value)} interface="popover">
                  {categories.map((cat) => (
                    <IonSelectOption key={cat.category_id} value={cat.category_id}>{cat.category_name}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem className="modal-form-item" lines="none">
                <div style={{ width: '100%', padding: '10px 0' }}>
                  <IonLabel position="stacked" style={{ marginBottom: '10px', display: 'block', fontWeight: 'bold' }}>Ảnh bìa khóa học</IonLabel>
                  {editPreviewUrl && (
                    <img src={editPreviewUrl} alt="Preview" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} />
                  )}
                  <div className="image-upload-wrapper">
                    <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleEditImageChange} />
                    <IonButton color="medium" fill="solid" onClick={triggerEditImageSelect}>
                      <IonIcon icon={imageOutline} slot="start" />
                      Thay đổi ảnh
                    </IonButton>
                    <span className="file-name-text" style={{ marginLeft: '10px', fontSize: '13px', fontStyle: 'italic', color: '#666' }}>
                      {editImageFile ? editImageFile.name : "Giữ nguyên ảnh hiện tại"}
                    </span>
                  </div>
                </div>
              </IonItem>

              <IonItem className="modal-form-item mb-20">
                <IonLabel position="stacked">Mô tả tóm tắt</IonLabel>
                <IonTextarea value={editingClass?.description} onIonInput={e => handleEditChange('description', e.detail.value!)} rows={4} />
              </IonItem>

              {/* Nút Xuất bản / Mở lại nếu đang là bản nháp hoặc đã đóng */}
              {(editingClass?.status === 'Draft' || editingClass?.status === 'Closed') && (
                <div style={{ marginBottom: '20px' }}>
                  <IonButton expand="block" color="success" onClick={handlePublishClass} disabled={isSubmitting}>
                    <IonIcon icon={checkmarkCircleOutline} slot="start" />
                    {editingClass?.status === 'Closed' ? 'MỞ LẠI KHÓA HỌC (PUBLIC)' : 'XUẤT BẢN KHÓA HỌC (PUBLIC)'}
                  </IonButton>
                </div>
              )}

              <div className="edit-modal-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '15px', paddingBottom: '30px', borderTop: '1px solid #eee' }}>
                
                {editingClass?.status === 'Draft' && editingClass?.student_count === 0 ? (
                  // Chỉ Draft và chưa có học sinh mới được xóa vĩnh viễn
                  <IonButton color="danger" fill="clear" onClick={confirmDeleteClass} style={{ margin: 0 }}>
                    <IonIcon icon={trashOutline} slot="start" />
                    XÓA LỚP VĨNH VIỄN
                  </IonButton>
                ) : editingClass?.status === 'Published' ? (
                  // Chỉ Public thì mới hiện nút Đóng lớp
                  <IonButton color="warning" fill="clear" onClick={confirmCloseClass} style={{ margin: 0 }}>
                    <IonIcon icon={trashOutline} slot="start" />
                    ĐÓNG LỚP HỌC
                  </IonButton>
                ) : (
                  <div></div>
                )}
                
                <div className="right-action-group" style={{ display: 'flex', gap: '10px' }}>
                  <IonButton fill="outline" color="medium" onClick={closeEditModal}>HỦY</IonButton>
                  <IonButton color="primary" onClick={handleUpdateClass} disabled={isSubmitting}>
                    {isSubmitting ? <IonSpinner name="dots" /> : 'CẬP NHẬT'}
                  </IonButton>
                </div>
              </div>
            </IonContent>
          </IonModal>

        </IonContent>
      )}
      
      {/*TẠO LỚP HỌC MỚI*/}
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} breakpoints={[0, 0.95, 1]} initialBreakpoint={0.95}>
        <IonHeader>
          <IonToolbar color="light">
            <IonTitle>Khởi tạo Lớp học mới</IonTitle>
            <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
            </IonButtons>
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

          <IonItem className="modal-form-item" lines="none">
            <div style={{ width: '100%', padding: '10px 0' }}>
              <IonLabel position="stacked" style={{ marginBottom: '10px', display: 'block', fontWeight: 'bold' }}>Ảnh bìa khóa học (Tùy chọn)</IonLabel>
              {previewUrl && (
                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} />
              )}
              <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) { setImageFile(file); setPreviewUrl(URL.createObjectURL(file)); }
                }} style={{ width: '100%' }}
              />
            </div>
          </IonItem>

          <IonItem className="modal-form-item mb-20">
            <IonLabel position="stacked">Mô tả tóm tắt</IonLabel>
            <IonTextarea value={description} onIonInput={e => setDescription(e.detail.value!)} placeholder="Giới thiệu qua về lớp học này..." rows={4} />
          </IonItem>

          <div className="modal-btn-group" style={{ paddingBottom: '30px' }}>
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