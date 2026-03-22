import React from 'react';
import { IonPage, IonContent, IonSpinner, useIonViewWillEnter } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const history = useHistory();

  useIonViewWillEnter(() => {
    const userData = localStorage.getItem('user');
    
    if (userData) {
      const user = JSON.parse(userData);
      
      if (user.role === 'Admin') {
        history.replace('/admin-dashboard');
      } else if (user.role === 'Instructor') {
        history.replace('/instructor-dashboard');
      } else if (user.role === 'Student') {
        history.replace('/student-dashboard');
      } else {
        history.replace('/login'); 
      }
    } else {
      history.replace('/login');
    }
  });

  return (
    <IonPage>
      <IonContent className="bg-gradient-blue ion-padding ion-text-center">
        <div style={{ marginTop: '50vh', transform: 'translateY(-50%)' }}>
          <IonSpinner color="light" name="crescent" />
          <p className="text-light">Đang tải không gian làm việc...</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;