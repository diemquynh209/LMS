import React, { useState, useEffect } from 'react';
import { 
  IonContent, IonPage, IonHeader, IonToolbar, 
  IonTitle, IonButtons, IonBackButton, IonCard, 
  IonCardHeader, IonCardTitle, IonCardContent, 
  IonItem, IonInput, IonButton, IonToast, IonSpinner, IonIcon, IonText,
  IonList, IonLabel,
  useIonViewWillEnter
} from '@ionic/react';
import { mailOutline, personOutline } from 'ionicons/icons';

const AdminManage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [instructors, setInstructors] = useState<any[]>([]); 

  // Lấy danh sách giảng viên từ Backend
  const fetchInstructors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/instructors');
      if (response.ok) {
        const data = await response.json();
        setInstructors(data);
      }
    } catch (error) {
      console.error("Không thể tải danh sách giảng viên");
    }
  };

  // Tự động chạy hàm lấy danh sách khi mở trang
  useIonViewWillEnter(()=> {fetchInstructors();});

  const handleSendInvite = async () => {
    if (!email) {
      setToastMsg(' Vui lòng nhập email giảng viên!');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructorEmail: email })
      });
      const data = await response.json();
      if (response.ok) {
        setToastMsg(`🎉 ${data.message} (Mã: ${data.code_generated})`);
        setEmail(''); 
        // Lấy lại danh sách mới (nếu cần)
      } else {
        setToastMsg (data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      setToastMsg('Không thể kết nối đến máy chủ Backend!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="transparent-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" text="Quay lại" className="white-text-btn" />
          </IonButtons>
          <IonTitle>Quản Trị Hệ Thống</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="bg-gradient-blue">
        
        
        <IonCard className="glass-card admin-form-card" style={{ marginBottom: '20px' }}>
          <IonCardHeader>
            <IonCardTitle className="ion-text-center glass-title" style={{ fontSize: '22px' }}>
              Mời Giảng Viên Mới
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem className="glass-input-item input-spacing" lines="none">
              <IonInput 
                type="email" 
                placeholder="Nhập email giảng viên..." 
                value={email} 
                onIonChange={e => setEmail(e.detail.value!)}
              />
            </IonItem>

            <IonButton expand="block" className="glass-button" onClick={handleSendInvite} disabled={isLoading} style={{ marginTop: '0' }}>
              {isLoading ? (
                <><IonSpinner name="crescent" style={{ marginRight: '10px' }} />Đang gửi thư...</>
              ) : (
                <><IonIcon icon={mailOutline} style={{ marginRight: '8px' }} />GỬI MÃ MỜI EMAIL</>
              )}
            </IonButton>
          </IonCardContent>
        </IonCard>

        
        <IonCard className="glass-card admin-form-card">
          <IonCardHeader>
            <IonCardTitle className="ion-text-center glass-title" style={{ fontSize: '22px' }}>
              Danh Sách Giảng Viên
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {instructors.length === 0 ? (
              <p className="text-light ion-text-center">Chưa có giảng viên nào trong hệ thống.</p>
            ) : (
              <IonList style={{ background: 'transparent' }}>
                {instructors.map((inst, index) => (
                  <IonItem key={index} lines="full" style={{ '--background': 'transparent', '--border-color': 'rgba(255,255,255,0.2)' }}>
                    <IonIcon icon={personOutline} slot="start" style={{ color: '#fff' }} />
                    <IonLabel>
                      <h2 className="text-white text-bold">{inst.full_name}</h2>
                      <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '14px', marginTop: '5px' }}>
                        📧 {inst.email}
                      </p>
                      {inst.phone && (
                        <p style={{ color: '#4caf50', fontSize: '14px', marginTop: '2px', fontWeight: 'bold' }}>
                          📞 {inst.phone}
                        </p>
                      )}
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            )}
          </IonCardContent>
        </IonCard>

        <IonToast isOpen={!!toastMsg} message={toastMsg} duration={3000} onDidDismiss={() => setToastMsg('')} color="dark" />
      </IonContent>
    </IonPage>
  );
};

export default AdminManage;