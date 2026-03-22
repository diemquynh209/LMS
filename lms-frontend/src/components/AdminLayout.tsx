import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonSplitPane, IonMenu, IonList, IonItem, 
  IonIcon, IonLabel, IonHeader, IonToolbar, IonTitle,
  IonButtons, IonButton, IonMenuButton, IonMenuToggle
} from '@ionic/react';
import { 
  schoolOutline, peopleOutline, bookOutline, documentTextOutline, 
  notificationsOutline, gridOutline, languageOutline, logOutOutline, menuOutline
} from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

const dict = {
  vi: { sidebarTitle: "Administrator", menu: { dashboard: "Quản lý chung", students: "Quản lý học sinh", instructors: "Quản lý giảng viên", classes: "Quản lý lớp học", categories: "Quản lý danh mục", notifications: "Quản lý thông báo" } },
  en: { sidebarTitle: "Administrator", menu: { dashboard: "Dashboard", students: "Manage Students", instructors: "Manage Instructors", classes: "Manage Classes", categories: "Manage Categories", notifications: "Notifications" } }
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, pageTitle }) => {
  const history = useHistory();
  const location = useLocation();
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const t = dict[lang];

  const handleLogout = () => {
    localStorage.clear();
    history.replace('/login');
  };

  return (
    <IonSplitPane contentId="main-content">
      <IonMenu menuId="admin-menu" contentId="main-content" type="overlay">
        <IonContent className="admin-sidebar">
          <div style={{ 
            padding: '15px 20px', 
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <h2 style={{ color: 'white', fontWeight: 'bold', margin: 0 }}>{t.sidebarTitle}</h2>
            <IonMenuToggle autoHide={false}>
              <IonButton fill="clear" style={{ '--color': 'white', margin: 0 }}>
                <IonIcon slot="icon-only" icon={menuOutline} style={{ fontSize: '28px' }}/>
              </IonButton>
            </IonMenuToggle>
          </div>
          <IonList style={{ background: 'transparent', marginTop: '10px' }}>
            <IonItem button className={`glass-menu-item ${location.pathname === '/admin-dashboard' ? 'active-menu' : ''}`} onClick={() => history.push('/admin-dashboard')}>
              <IonIcon slot="start" icon={gridOutline} />
              <IonLabel>{t.menu.dashboard}</IonLabel>
            </IonItem>
            <IonItem button className={`glass-menu-item ${location.pathname === '/admin-students' ? 'active-menu' : ''}`} onClick={() => history.push('/admin-students')}>
              <IonIcon slot="start" icon={peopleOutline} />
              <IonLabel>{t.menu.students}</IonLabel>
            </IonItem>
            <IonItem button className={`glass-menu-item ${location.pathname === '/admin-instructors' ? 'active-menu' : ''}`} onClick={() => history.push('/admin-instructors')}>
              <IonIcon slot="start" icon={schoolOutline} />
              <IonLabel>{t.menu.instructors}</IonLabel>
            </IonItem>
            <IonItem button className={`glass-menu-item ${location.pathname === '/admin-classes' ? 'active-menu' : ''}`} onClick={() => history.push('/admin-classes')}>
              <IonIcon slot="start" icon={bookOutline} />
              <IonLabel>{t.menu.classes}</IonLabel>
            </IonItem>
            <IonItem button className={`glass-menu-item ${location.pathname === '/admin-categories' ? 'active-menu' : ''}`} onClick={() => history.push('/admin-categories')}>
              <IonIcon slot="start" icon={documentTextOutline} />
              <IonLabel>{t.menu.categories}</IonLabel>
            </IonItem>
            <IonItem button className={`glass-menu-item ${location.pathname === '/admin-notifications' ? 'active-menu' : ''}`} onClick={() => history.push('/admin-notifications')}>
              <IonIcon slot="start" icon={notificationsOutline} />
              <IonLabel>{t.menu.notifications}</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      <IonPage id="main-content">
        <IonHeader className="ion-no-border">
          <IonToolbar color="light">
            <IonButtons slot="start"><IonMenuButton menu="admin-menu" /></IonButtons>
            <IonTitle>{pageTitle}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')} className="text-bold">
                <IonIcon slot="start" icon={languageOutline} /> {lang.toUpperCase()}
              </IonButton>
              <IonButton onClick={handleLogout} color="danger">
                <IonIcon slot="start" icon={logOutOutline} />
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