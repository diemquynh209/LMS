import React from 'react';
import { 
  IonContent, IonPage, IonCard, 
  IonCardHeader, IonCardTitle, IonCardContent, 
  IonItem, IonButton, IonToast, IonIcon,
  IonList, IonLabel, IonSelect, IonSelectOption
} from '@ionic/react';
import { personOutline, trashOutline } from 'ionicons/icons';

// Dùng lại cái Header màu xanh kính mờ
import AppHeader from '../../components/AppHeader'; 
import { useAdminStudents } from './useAdmin-Students';

const AdminStudents: React.FC = () => {
  const {
    toastMsg, setToastMsg,
    students,
    handleRoleChange, handleDeleteUser
  } = useAdminStudents();

  return (
    <IonPage>
      <AppHeader 
        title="Quản Lý Học Viên" 
        showBackButton={true} 
        backDefaultHref="/dashboard" 
      />

      <IonContent className="bg-gradient-blue">
        {/* CHỈ CÓ KHỐI DANH SÁCH HỌC VIÊN, BỎ KHỐI GỬI EMAIL */}
        <IonCard className="glass-card admin-form-card" style={{ marginTop: '20px' }}>
          <IonCardHeader>
            <IonCardTitle className="ion-text-center glass-title" style={{ fontSize: '22px' }}>
              Danh Sách Học Viên
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {students.length === 0 ? (
              <p className="text-light ion-text-center">Chưa có học viên nào trong hệ thống.</p>
            ) : (
              <IonList style={{ background: 'transparent' }}>
                {students.map((student: any, index: any) => (
                  <IonItem key={student.user_id || index} lines="full" style={{ '--background': 'transparent', '--border-color': 'rgba(255,255,255,0.2)', alignItems: 'flex-start' }}>
                    
                    <IonIcon icon={personOutline} slot="start" style={{ color: '#fff', fontSize: '24px', marginTop: '15px' }} />
                    
                    <IonLabel style={{ margin: '12px 0', overflow: 'visible' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 className="text-white text-bold" style={{ fontSize: '18px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {student.full_name}
                        </h2>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <IonSelect 
                            value={student.role} 
                            interface="popover"
                            className="custom-role-select" 
                            onIonChange={(e) => handleRoleChange(student.user_id, student.role, e.detail.value)}
                          >
                            <IonSelectOption value="Student">Học viên</IonSelectOption>
                            <IonSelectOption value="Instructor">Giảng viên</IonSelectOption>
                          </IonSelect>

                          <IonButton fill="clear" color="danger" onClick={() => handleDeleteUser(student.user_id, student.full_name)} style={{ margin: 0, height: '32px' }}>
                            <IonIcon icon={trashOutline} slot="icon-only" style={{ fontSize: '24px' }} />
                          </IonButton>
                        </div>
                      </div>

                      <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '14px', marginTop: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        📧 {student.email}
                      </p>

                      {student.phone && (
                        <p style={{ color: '#4caf50', fontSize: '14px', marginTop: '4px', fontWeight: 'bold' }}>
                          📞 {student.phone}
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

export default AdminStudents;