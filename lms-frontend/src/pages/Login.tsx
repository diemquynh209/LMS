import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonItem, 
  IonInput, IonButton, IonText 
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = () => {
    console.log('Dữ liệu gửi đi:', { email, password });
  };

  return (
    <IonPage>
      <IonContent className="bg-gradient-blue">
        <IonCard className="glass-card">
          <IonCardHeader>
            <IonCardTitle className="ion-text-center glass-title">
              Login Form
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            {/* Ô nhập Email */}
            <IonItem className="glass-input-item" lines="none">
              <IonInput 
                type="email" 
                placeholder="Email address"
                value={email} 
                onIonChange={e => setEmail(e.detail.value!)}>
              </IonInput>
            </IonItem>

            {/* Ô nhập Mật khẩu */}
            <IonItem className="glass-input-item" lines="none">
              <IonInput 
                type="password" 
                placeholder="********"
                value={password} 
                onIonChange={e => setPassword(e.detail.value!)}>
              </IonInput>
            </IonItem>

            {/* Nút đăng nhập */}
            <IonButton expand="block" className="glass-button" onClick={handleLogin}>
              Login
            </IonButton>

            {/* Chuyển hướng */}
            <div className="ion-text-center ion-margin-top" style={{ marginTop: '30px' }}>
              <IonText style={{ color: 'rgba(255,255,255,0.8)' }}>Bạn chưa có tài khoản? </IonText>
              <br/>
              <IonText 
                style={{ color: '#ffffff', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
                onClick={() => history.push('/register')}
              >
                Đăng ký ngay
              </IonText>
            </div>
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Login;