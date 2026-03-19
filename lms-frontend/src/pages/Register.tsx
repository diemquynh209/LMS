import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonItem, 
  IonInput, IonButton, IonText, IonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone,setPhone] = useState('')
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const history = useHistory();

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          full_name: fullName, 
          email: email,
          phone:phone,
          password: password, 
          invite_code: inviteCode 
        })
      });    
      const data = await response.json();
      if (response.ok) {
        setToastMsg(' Đăng ký thành công! Đang chuyển sang Đăng nhập...');
        // Tự động chuyển về trang đăng nhập sau 2 giây
        setTimeout(() => history.push('/login'), 2000);
      } else {
        setToastMsg + (data.message || 'Lỗi đăng ký');
      }
    } catch (error) {
      setToastMsg(' Không thể kết nối đến máy chủ Backend!');
    }
  };
  return (
    <IonPage>
      <IonContent className="bg-gradient-blue">
        <IonCard className="glass-card">
          <IonCardHeader>
            <IonCardTitle className="ion-text-center glass-title">Register Form</IonCardTitle>
          </IonCardHeader>
          
          <IonCardContent>
            <IonItem className="glass-input-item" lines="none">
              <IonInput placeholder="Họ và tên" value={fullName} onIonChange={e => setFullName(e.detail.value!)}></IonInput>
            
            </IonItem>
            <IonItem className="glass-input-item" lines="none">
              <IonInput type="email" placeholder="Email address" value={email} onIonChange={e => setEmail(e.detail.value!)}></IonInput>
            </IonItem>
            
            <IonItem className="glass-input-item input-spacing" lines="none">
              <IonInput 
                type="tel" 
                placeholder="Số điện thoại" 
                value={phone} 
                onIonChange={e => setPhone(e.detail.value!)}>
              </IonInput>
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
              <IonText style={{ color: '#ffffff', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }} onClick={() => history.push('/login')}>
                Đăng nhập
              </IonText>
            </div>
          </IonCardContent>
        </IonCard>

        <IonToast isOpen={!!toastMsg} message={toastMsg} duration={2500} onDidDismiss={() => setToastMsg('')} color="dark"/>
      </IonContent>
    </IonPage>
  );
};

export default Register;