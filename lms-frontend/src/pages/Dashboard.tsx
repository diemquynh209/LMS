import React, { useEffect, useState } from 'react';
import { 
  IonContent, IonPage, IonHeader, IonToolbar, 
  IonTitle, IonButton, IonButtons, IonIcon, IonText, IonCard, IonCardContent
} from '@ionic/react';
import { logOutOutline, personCircleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const Dashboard: React.FC = () => 
{
  const history = useHistory();
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      history.push('/login');
    }
  }, [history]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    history.push('/login');
  };

  return (
    <IonPage>
      {}
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Hệ Thống LMS</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon slot="start" icon={logOutOutline} />
              Đăng xuất
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {user && (
          <IonCard>
            <IonCardContent className="ion-text-center">
              <IonIcon icon={personCircleOutline} style={{ fontSize: '80px', color: '#0277bd' }} />
              <h2>Xin chào, <b>{user.full_name}</b>!</h2>
              <IonText color="medium">
                <p>Email: {user.email}</p>
                <p>Quyền hạn: <b>{user.role}</b></p>
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {}
        <div className="ion-margin-top">
          {user?.role === 'Admin' && (
            <IonCard color="danger">
              <IonCardContent>
                <h3>Khu vực của Quản trị viên</h3>
                <p>Tại đây bạn có thể quản lý người dùng, tạo mã mời giảng viên...</p>
              </IonCardContent>
            </IonCard>
          )}

          {user?.role === 'Instructor' && (
            <IonCard color="success">
              <IonCardContent>
                <h3>Khu vực của Giảng viên</h3>
                <p>Tại đây bạn có thể tạo lớp học mới, đăng tải video, bài giảng...</p>
              </IonCardContent>
            </IonCard>
          )}

          {user?.role === 'Student' && (
            <IonCard color="tertiary">
              <IonCardContent>
                <h3>Khu vực của Học viên</h3>
                <p>Tại đây bạn có thể xem danh sách khóa học, tiến độ học tập...</p>
              </IonCardContent>
            </IonCard>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;