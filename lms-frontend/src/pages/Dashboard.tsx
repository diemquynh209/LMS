import React, { useEffect, useState } from 'react';
import { 
  IonContent, IonPage, IonHeader, IonToolbar, 
  IonTitle, IonButton, IonButtons, IonIcon, IonText, IonCard, IonCardContent,
  useIonViewWillEnter
} from '@ionic/react';
import { logOutOutline, personCircleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import AppHeader from '../components/AppHeader';

const Dashboard: React.FC = () => {
  const history = useHistory();
  const [user, setUser] = useState<any>(null);

  useIonViewWillEnter(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      history.push('/login');
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    history.push('/login');
  };

  return (
    <IonPage>
      <AppHeader 
        title="Hệ Thống LMS" 
        rightContent={
          <IonButton onClick={handleLogout} className="text-white">
          <IonIcon icon={logOutOutline} slot="start" />
            ĐĂNG XUẤT
          </IonButton>
        } 
      />

      <IonContent className="bg-gradient-blue">
        {user && (
          <div className="ion-text-center" style={{ paddingTop: '30px', paddingBottom: '10px' }}>
            <h2 className="text-white text-bold" style={{ fontSize: '24px', marginTop: '10px' }}>
              Xin chào, {user.full_name}!
            </h2>
            <IonText className="text-light">
              <p style={{ margin: '5px 0' }}>Email: {user.email}</p>
              <p style={{ margin: '5px 0' }}>Quyền hạn: <b className="text-white">{user.role}</b></p>
            </IonText>
          </div>
        )}

        <div>
        {user?.role === 'Admin' && (
            <>
              {/* Qly giảng viên */}
              <IonCard 
                className="glass-card dashboard-card clickable-glass" 
                onClick={() => history.push('/admin-instructors')}
              >
                <IonCardContent className="ion-text-center" style={{ padding: '35px 10px' }}>
                  <h2 className="text-white text-bold" style={{ fontSize: '24px', margin: '0' }}>
                    Quản Lý Giảng Viên
                  </h2>
                </IonCardContent>
              </IonCard>

              {/* Qly lớp học*/}
              <IonCard 
                className="glass-card dashboard-card clickable-glass" 
                onClick={() => history.push('/admin-classes')}
              >
                <IonCardContent className="ion-text-center" style={{ padding: '35px 10px' }}>
                  <h2 className="text-white text-bold" style={{ fontSize: '24px', margin: '0' }}>
                    Quản Lý Lớp Học
                  </h2>
                </IonCardContent>
              </IonCard>
            </>
          )}

          {user?.role === 'Instructor' && (
            <IonCard className="glass-card dashboard-card">
              <IonCardContent className="ion-text-center">
                <h3 className="card-heading">Khu vực Giảng viên</h3>
                <p className="text-light">Tại đây bạn có thể tạo lớp học mới, đăng tải video, bài giảng...</p>
              </IonCardContent>
            </IonCard>
          )}

          {user?.role === 'Student' && (
            <IonCard className="glass-card dashboard-card">
              <IonCardContent className="ion-text-center">
                <h3 className="card-heading">Khu vực Học viên</h3>
                <p className="text-light">Tại đây bạn có thể xem danh sách khóa học, tiến độ học tập...</p>
              </IonCardContent>
            </IonCard>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;