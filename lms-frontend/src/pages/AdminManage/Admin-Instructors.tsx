import React from 'react';
import { 
  IonContent, IonPage, IonHeader, IonToolbar, 
  IonTitle, IonButtons, IonBackButton, IonCard, 
  IonCardHeader, IonCardTitle, IonCardContent, 
  IonItem, IonInput, IonButton, IonToast, IonSpinner, IonIcon,
  IonList, IonLabel, IonSelect, IonSelectOption
} from '@ionic/react';
import { mailOutline, personOutline, trashOutline } from 'ionicons/icons';
import AppHeader from '../../components/AppHeader';
import { useAdminInstructors } from './useAdmin-Instructors';

const AdminInstructors: React.FC = () => {
  const {
    email, setEmail,
    toastMsg, setToastMsg,
    isLoading, instructors,
    handleSendInvite, handleRoleChange, handleDeleteUser
  } = useAdminInstructors();

  return (
    <IonPage>
      <AppHeader 
        title="Quản Trị Hệ Thống" 
        showBackButton={true} 
        backDefaultHref="/dashboard" 
      />

      <IonContent className="bg-gradient-blue">
        
        {/* FORM MỜI GIẢNG VIÊN */}
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

        {/* DANH SÁCH GIẢNG VIÊN */}
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
                  <IonItem key={inst.user_id || index} lines="full" style={{ '--background': 'transparent', '--border-color': 'rgba(255,255,255,0.2)', alignItems: 'flex-start' }}>
                    
                    <IonIcon icon={personOutline} slot="start" style={{ color: '#fff', fontSize: '24px', marginTop: '15px' }} />
                    
                    <IonLabel style={{ margin: '12px 0', overflow: 'visible' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 className="text-white text-bold" style={{ fontSize: '18px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {inst.full_name}
                        </h2>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <IonSelect 
                              value={inst.role} 
                              interface="popover"
                              className="custom-role-select" 
                              onIonChange={(e) => handleRoleChange(inst.user_id, e.detail.value)}
                          >
                              <IonSelectOption value="Instructor">Giảng viên</IonSelectOption>
                              <IonSelectOption value="Student">Học viên</IonSelectOption>
                          </IonSelect>

                          <IonButton fill="clear" color="danger" onClick={() => handleDeleteUser(inst.user_id, inst.full_name)} style={{ margin: 0, height: '32px' }}>
                            <IonIcon icon={trashOutline} slot="icon-only" style={{ fontSize: '24px' }} />
                          </IonButton>
                        </div>
                      </div>

                      <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '14px', marginTop: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        📧 {inst.email}
                      </p>

                      {inst.phone && (
                        <p style={{ color: '#4caf50', fontSize: '14px', marginTop: '4px', fontWeight: 'bold' }}>
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

export default AdminInstructors;