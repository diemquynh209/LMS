import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonItem, 
  IonInput, IonButton, IonText 
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const history = useHistory();

  const handleRegister = () => {
    console.log('Dữ liệu đăng ký:', { fullName, email, password, inviteCode });
  };

  return (
    <IonPage>
      <IonContent className="bg-gradient-blue">
        <IonCard className="glass-card">
          <IonCardHeader>
            <IonCardTitle className="ion-text-center glass-title">
              Register Form
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            
            <IonItem className="glass-input-item" lines="none">
              <IonInput placeholder="Họ và tên" value={fullName} onIonChange={e => setFullName(e.detail.value!)}></IonInput>
            </IonItem>
            
            <IonItem className="glass-input-item" lines="none">
              <IonInput type="email" placeholder="Email address" value={email} onIonChange={e => setEmail(e.detail.value!)}></IonInput>
            </IonItem>
            
            <IonItem className="glass-input-item" lines="none">
              <IonInput type="password" placeholder="Mật khẩu" value={password} onIonChange={e => setPassword(e.detail.value!)}></IonInput>
            </IonItem>
            
            <IonItem className="glass-input-item" lines="none">
              <IonInput placeholder="Mã mời (Dành cho Giảng viên)" value={inviteCode} onIonChange={e => setInviteCode(e.detail.value!)}></IonInput>
            </IonItem>

            <IonButton expand="block" className="glass-button" onClick={handleRegister}>
              Register
            </IonButton>

            <div className="ion-text-center ion-margin-top" style={{ marginTop: '20px' }}>
              <IonText style={{ color: 'rgba(255,255,255,0.8)' }}>Đã có tài khoản? </IonText>
              <IonText 
                style={{ color: '#ffffff', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }} 
                onClick={() => history.push('/login')}
              >
                Đăng nhập
              </IonText>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Register;