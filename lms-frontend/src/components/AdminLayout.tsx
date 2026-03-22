import React from 'react';
import { 
  IonContent, IonPage, IonSplitPane, IonMenu, IonList, IonItem, 
  IonIcon, IonLabel, IonHeader, IonToolbar, IonTitle,
  IonButtons, IonButton, IonMenuButton, IonMenuToggle 
} from '@ionic/react';
import { 
  schoolOutline, peopleOutline, bookOutline, documentTextOutline, 
  notificationsOutline, gridOutline, logOutOutline, menuOutline
} from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, pageTitle }) => {
  const history = useHistory();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    history.replace('/login');
  };

  return (
    <IonSplitPane contentId="main-content">
      <IonMenu contentId="main-content" type="overlay" menuId="admin-menu">
        <IonContent className="admin-sidebar">     
          <div style={{ padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: 'white', fontWeight: 'bold', margin: 0 }}>Administrator</h2>
            <IonMenuToggle autoHide={false}>
              <IonButton fill="clear" style={{ '--color': 'white', margin: 0 }}>
                <IonIcon slot="icon-only" icon={menuOutline} style={{ fontSize: '28px' }}/>
              </IonButton>
            </IonMenuToggle>
          </div>

          <IonList style={{ background: 'transparent', marginTop: '10px' }}>           
            <IonMenuToggle autoHide={false}>
              <IonItem button routerLink="/admin-dashboard" routerDirection="root" className={`glass-menu-item ${location.pathname === '/admin-dashboard' ? 'active-menu' : ''}`}>
                <IonIcon slot="start" icon={gridOutline} />
                <IonLabel>Quản lý chung</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={false}>
              <IonItem button routerLink="/admin-students" routerDirection="root" className={`glass-menu-item ${location.pathname === '/admin-students' ? 'active-menu' : ''}`}>
                <IonIcon slot="start" icon={peopleOutline} />
                <IonLabel>Quản lý học viên</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={false}>
              <IonItem button routerLink="/admin-instructors" routerDirection="root" className={`glass-menu-item ${location.pathname === '/admin-instructors' ? 'active-menu' : ''}`}>
                <IonIcon slot="start" icon={schoolOutline} />
                <IonLabel>Quản lý giảng viên</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={false}>
              <IonItem button routerLink="/admin-classes" routerDirection="root" className={`glass-menu-item ${location.pathname === '/admin-classes' ? 'active-menu' : ''}`}>
                <IonIcon slot="start" icon={bookOutline} />
                <IonLabel>Quản lý lớp học</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={false}>
              <IonItem button routerLink="/admin-categories" routerDirection="root" className={`glass-menu-item ${location.pathname === '/admin-categories' ? 'active-menu' : ''}`}>
                <IonIcon slot="start" icon={documentTextOutline} />
                <IonLabel>Quản lý danh mục</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={false}>
              <IonItem button routerLink="/admin-notifications" routerDirection="root" className={`glass-menu-item ${location.pathname === '/admin-notifications' ? 'active-menu' : ''}`}>
                <IonIcon slot="start" icon={notificationsOutline} />
                <IonLabel>Quản lý thông báo</IonLabel>
              </IonItem>
            </IonMenuToggle>

          </IonList>
        </IonContent>
      </IonMenu>

      <IonPage id="main-content">
        <IonHeader className="ion-no-border">
          <IonToolbar color="light">
            <IonButtons slot="start">
              <IonMenuButton menu="admin-menu" />
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

        <IonContent style={{ '--background': '#ECF0F5' }}>
          {children}
        </IonContent>
      </IonPage>
    </IonSplitPane>
  );
};

export default AdminLayout;