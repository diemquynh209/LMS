import React, { useState, useRef, useEffect } from 'react';
import { 
  IonModal, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonItem, IonLabel, IonInput, IonButton, IonIcon, IonSpinner, IonToast, IonAvatar
} from '@ionic/react';
import { cameraOutline, saveOutline, closeOutline, personCircleOutline } from 'ionicons/icons';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: (newUser: any) => void; 
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, onProfileUpdated }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(''); // Thêm state Ngày sinh
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Lấy dữ liệu sẵn có khi mở Modal
  useEffect(() => {
    if (isOpen) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        setFullName(userObj.full_name || '');
        setEmail(userObj.email || '');
        setPhone(userObj.phone || '');
        setAvatarUrl(userObj.avatar_url || '');
        
        if (userObj.date_of_birth) {
            setDateOfBirth(new Date(userObj.date_of_birth).toISOString().split('T')[0]);
        } else {
            setDateOfBirth('');
        }
      }
      setAvatarFile(null);
      setPreviewUrl('');
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleSave = async () => {
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setToastMsg('Vui lòng điền đủ thông tin bắt buộc!');
      return;
    }

    setLoading(true);
    try {
      const storedToken = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('full_name', fullName);
      formData.append('date_of_birth', dateOfBirth); // Đẩy ngày sinh vào FormData
      formData.append('email', email);
      formData.append('phone', phone);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await fetch(`http://localhost:5000/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${storedToken}`
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setToastMsg('Cập nhật hồ sơ thành công!');
        // Cập nhật lại localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        onProfileUpdated(data.user);
        setTimeout(onClose, 1000);
      } else {
        setToastMsg(data.message || 'Lỗi cập nhật!');
      }
    } catch (error) {
      setToastMsg('Lỗi kết nối máy chủ!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IonModal isOpen={isOpen} onDidDismiss={onClose} breakpoints={[0, 0.7, 0.9]} initialBreakpoint={0.7}>
        <IonHeader>
          <IonToolbar color="light">
            <IonTitle>Hồ sơ cá nhân</IonTitle>
            <IonButton slot="end" fill="clear" onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        
        <IonContent className="ion-padding">
          {/* KHU VỰC ẢNH ĐẠI DIỆN */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <IonAvatar style={{ width: '100px', height: '100px', margin: '0 auto', border: '3px solid #3880ff' }}>
                {previewUrl || avatarUrl ? (
                  <img src={previewUrl || avatarUrl} alt="Avatar" style={{objectFit: 'cover'}} />
                ) : (
                  <IonIcon icon={personCircleOutline} style={{ fontSize: '100px', color: '#ccc', margin: '-5px' }} />
                )}
              </IonAvatar>
              <IonButton 
                shape="round" size="small" color="primary" 
                style={{ position: 'absolute', bottom: '-5px', right: '-15px' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <IonIcon slot="icon-only" icon={cameraOutline} />
              </IonButton>
              <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
            </div>
          </div>

          {/* FORM THÔNG TIN */}
          <IonItem style={{ marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <IonLabel position="stacked">Họ và tên <span style={{color:'red'}}>*</span></IonLabel>
            <IonInput value={fullName} onIonInput={e => setFullName(e.detail.value!)} placeholder="Nhập họ tên đầy đủ..." />
          </IonItem>

          {/* Form nhập Ngày sinh  */}
          <IonItem style={{ marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <IonLabel position="stacked">Ngày sinh</IonLabel>
            <IonInput type="date" value={dateOfBirth} onIonChange={e => setDateOfBirth(e.detail.value!)} />
          </IonItem>

          <IonItem style={{ marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <IonLabel position="stacked">Email đăng nhập <span style={{color:'red'}}>*</span></IonLabel>
            <IonInput type="email" value={email} onIonInput={e => setEmail(e.detail.value!)} placeholder="VD: user@gmail.com" />
          </IonItem>

          <IonItem style={{ marginBottom: '25px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <IonLabel position="stacked">Số điện thoại <span style={{color:'red'}}>*</span></IonLabel>
            <IonInput type="tel" value={phone} onIonInput={e => setPhone(e.detail.value!)} placeholder="Nhập số điện thoại..." />
          </IonItem>

          <IonButton expand="block" color="primary" onClick={handleSave} disabled={loading}>
            {loading ? <IonSpinner name="crescent" /> : <><IonIcon slot="start" icon={saveOutline} /> LƯU THAY ĐỔI</>}
          </IonButton>
        </IonContent>
      </IonModal>

      <IonToast isOpen={!!toastMsg} message={toastMsg} duration={3000} onDidDismiss={() => setToastMsg('')} />
    </>
  );
};

export default UserProfileModal;