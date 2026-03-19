import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonItem, 
  IonInput, IonButton, IonText, IonToast 
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastMsg, setToastMsg] = useState(''); // Biến lưu thông báo
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();

      if (response.ok) {
        setToastMsg('🎉 Đăng nhập thành công!');
        localStorage.setItem('token', data.token); 
        localStorage.setItem('user',JSON.stringify(data.user));
        setTimeout(()=>{
          history.push('/dashboard');
        },1000);
      } else {
        setToastMsg('❌ ' + (data.message || 'Lỗi đăng nhập'));
      }
    } catch (error) {
      setToastMsg('⚠️ Không thể kết nối đến máy chủ Backend!');
    }
  };

  return (
    <IonPage>
      <IonContent className="bg-gradient-blue">
        <IonCard className="glass-card">
          <IonCardHeader>
            <IonCardTitle className="ion-text-center glass-title">Login Form</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem className="glass-input-item" lines="none">
              <IonInput type="email" placeholder="Email address" value={email} onIonChange={e => setEmail(e.detail.value!)}></IonInput>
            </IonItem>

            <IonItem className="glass-input-item" lines="none">
              <IonInput type="password" placeholder="********" value={password} onIonChange={e => setPassword(e.detail.value!)}></IonInput>
            </IonItem>

            <IonButton expand="block" className="glass-button" onClick={handleLogin}>
              Login
            </IonButton>

            <div className="ion-text-center ion-margin-top" style={{ marginTop: '30px' }}>
              <IonText style={{ color: 'rgba(255,255,255,0.8)' }}>Bạn chưa có tài khoản? </IonText>
              <br/>
              <IonText style={{ color: '#ffffff', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }} onClick={() => history.push('/register')}>
                Đăng ký ngay
              </IonText>
            </div>
          </IonCardContent>
        </IonCard>

        <IonToast 
          isOpen={!!toastMsg} 
          message={toastMsg} 
          duration={2500} 
          onDidDismiss={() => setToastMsg('')} 
          color="dark"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;