import React from 'react';
import { 
  IonContent, IonPage, IonSplitPane, IonMenu, IonList, IonItem, 
  IonIcon, IonLabel, IonHeader, IonToolbar, IonTitle,
  IonButtons, IonButton, IonMenuButton, IonMenuToggle 
} from '@ionic/react';
import { 
  schoolOutline, bookOutline, notificationsOutline, gridOutline, 
  logOutOutline, menuOutline, folderOpenOutline
} from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import '../theme/layouts/InstructorLayout.css';
interface InstructorLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

const InstructorLayout: React.FC<InstructorLayoutProps> = ({ children, pageTitle }) => {
  const history = useHistory();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    history.replace('/login');
  };

  return (
    <IonSplitPane contentId="instructor-main-content">
      <IonMenu contentId="instructor-main-content" type="overlay" menuId="instructor-menu">
        <IonContent className="instructor-sidebar">     
          <div style={{ padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src="/favicon.png" 
                alt="Logo" 
                style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
              />
              <h2 style={{ color: 'white', fontWeight: 'bold', margin: 0, fontSize: '20px' }}>Instructor</h2>
            </div>

            <IonMenuToggle autoHide={false}>
              <IonButton fill="clear" style={{ '--color': 'white', margin: 0 }}>
                <IonIcon slot="icon-only" icon={menuOutline} style={{ fontSize: '28px' }}/>
              </IonButton>
            </IonMenuToggle>
          </div>

          <IonList style={{ background: 'transparent', marginTop: '10px' }}>           
            <IonMenuToggle autoHide={false}>
              <IonItem button routerLink="/instructor-dashboard" routerDirection="root" className={`glass-menu-item ${location.pathname === '/instructor-dashboard' ? 'active-menu' : ''}`}>
                <IonIcon slot="start" icon={gridOutline} />
                <IonLabel>Bảng điều khiển</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={false}>
              <IonItem button routerLink="/instructor-classes" routerDirection="root" className={`glass-menu-item ${location.pathname.includes('/instructor-classes') ? 'active-menu' : ''}`}>
                <IonIcon slot="start" icon={bookOutline} />
                <IonLabel>Lớp học của tôi</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={false}>
              <IonItem button routerLink="/instructor-question-bank" routerDirection="root" className={`glass-menu-item ${location.pathname.includes('/instructor-question-bank') ? 'active-menu' : ''}`}>
                <IonIcon slot="start" icon={folderOpenOutline} />
                <IonLabel>Ngân hàng câu hỏi</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={false}>
              <IonItem button routerLink="/instructor-notifications" routerDirection="root" className={`glass-menu-item ${location.pathname === '/instructor-notifications' ? 'active-menu' : ''}`}>
                <IonIcon slot="start" icon={notificationsOutline} />
                <IonLabel>Thông báo</IonLabel>
              </IonItem>
            </IonMenuToggle>

          </IonList>
        </IonContent>
      </IonMenu>

      <IonPage id="instructor-main-content">
        <IonHeader className="ion-no-border">
          <IonToolbar color="light">
            <IonButtons slot="start">
              <IonMenuButton menu="instructor-menu" />
            </IonButtons>      
            <IonTitle>{pageTitle}</IonTitle>      
            <IonButtons slot="end">
              <IonButton 
                onClick={handleLogout} 
                color="danger" 
                style={{ fontWeight: 'bold', fontSize: '15px', textTransform: 'none', marginRight: '10px' }}
              >
                <IonIcon slot="start" icon={logOutOutline} style={{ fontSize: '22px' }}/> 
                Đăng xuất
              </IonButton>
            </IonButtons>      
          </IonToolbar>
        </IonHeader>

        <IonContent style={{ '--background': '#F4F6F8' }}>
          {children}
        </IonContent>
      </IonPage>
    </IonSplitPane>
  );
};

export default InstructorLayout;