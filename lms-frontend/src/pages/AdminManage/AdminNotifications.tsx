import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { 
  IonButton, IonIcon, IonToast, IonModal, IonHeader, 
  IonToolbar, IonTitle, IonContent, IonItem, IonLabel, 
  IonInput, IonTextarea, IonSelect, IonSelectOption 
} from '@ionic/react';
import { paperPlaneOutline, megaphoneOutline } from 'ionicons/icons';
import { useAdminNotifications } from '../../hooks/admin/useAdminNotifications';
import NotificationTable from '../../components/shared/NotificationTable';

const AdminNotifications: React.FC = () => {
  const { notifications, toastMsg, setToastMsg, isLoading, handleSendNotification } = useAdminNotifications();
  
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState('All');
  const [type, setType] = useState('System');

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      setToastMsg('Vui lòng nhập đủ tiêu đề và nội dung!');
      return;
    }
    
    const success = await handleSendNotification({ title, message, target_role: targetRole, type });
    if (success) {
      setShowModal(false);
      setTitle('');
      setMessage('');
    }
  };

  return (
    <AdminLayout pageTitle="Quản Lý Thông Báo">
      <div style={{ padding: '20px', paddingBottom: '80px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontWeight: 'bold' }}>Lịch sử Thông báo</h2>
          
          <IonButton color="primary" onClick={() => setShowModal(true)}>
            <IonIcon slot="start" icon={paperPlaneOutline} /> TẠO THÔNG BÁO
          </IonButton>
        </div>

        <NotificationTable notifications={notifications} />

      </div>
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} breakpoints={[0, 0.5, 0.8, 1]} initialBreakpoint={0.8}>
        <IonHeader>
          <IonToolbar color="light">
            <IonTitle>Soạn Thông Báo Mới</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem style={{ marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <IonLabel position="stacked">Tiêu đề thông báo <span style={{ color: 'red' }}>*</span></IonLabel>
            <IonInput value={title} onIonInput={e => setTitle(e.detail.value!)} placeholder="VD: Bảo trì hệ thống..." />
          </IonItem>
          <IonItem style={{ marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <IonLabel position="stacked">Nội dung <span style={{ color: 'red' }}>*</span></IonLabel>
            <IonTextarea value={message} onIonInput={e => setMessage(e.detail.value!)} placeholder="Nhập nội dung chi tiết..." rows={5} />
          </IonItem>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <IonItem style={{ flex: 1, border: '1px solid #ddd', borderRadius: '8px' }}>
              <IonLabel position="stacked">Đối tượng nhận</IonLabel>
              <IonSelect value={targetRole} onIonChange={e => setTargetRole(e.detail.value)} interface="popover">
                <IonSelectOption value="All">Tất cả người dùng</IonSelectOption>
                <IonSelectOption value="Student">Chỉ Học viên</IonSelectOption>
                <IonSelectOption value="Instructor">Chỉ Giảng viên</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem style={{ flex: 1, border: '1px solid #ddd', borderRadius: '8px' }}>
              <IonLabel position="stacked">Loại thông báo</IonLabel>
              <IonSelect value={type} onIonChange={e => setType(e.detail.value)} interface="popover">
                <IonSelectOption value="System">Hệ thống (System)</IonSelectOption>
                <IonSelectOption value="Course">Khóa học (Course)</IonSelectOption>
              </IonSelect>
            </IonItem>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
            <IonButton expand="block" color="medium" fill="outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>HỦY BỎ</IonButton>
            <IonButton expand="block" color="primary" style={{ flex: 1 }} onClick={handleSend} disabled={isLoading}>
              <IonIcon slot="start" icon={megaphoneOutline} /> {isLoading ? 'ĐANG GỬI...' : 'PHÁT THÔNG BÁO'}
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      <IonToast isOpen={!!toastMsg} message={toastMsg} duration={3000} onDidDismiss={() => setToastMsg('')} />
    </AdminLayout>
  );
};

export default AdminNotifications;