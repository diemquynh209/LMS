import React, { useState, useEffect } from 'react';
import { 
  IonContent, IonPage, IonSplitPane, IonMenu, IonList, IonItem, 
  IonIcon, IonLabel, IonHeader, IonToolbar, IonTitle,
  IonButtons, IonButton, IonMenuButton, IonGrid, IonRow, IonCol, IonCard, IonCardContent
} from '@ionic/react';
import { 
  schoolOutline, peopleOutline, bookOutline, documentTextOutline, 
  notificationsOutline, gridOutline, languageOutline, logOutOutline,
  warningOutline
} from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const dict = {
  vi: {
    sidebarTitle: "Administrator",
    menu: { dashboard: "Quản lý chung", students: "Quản lý học sinh", instructors: "Quản lý giảng viên", classes: "Quản lý lớp học", categories: "Quản lý danh mục", notifications: "Quản lý thông báo" },
    cards: { students: "Tổng số học viên", instructors: "Tổng số giảng viên", classes: "Tổng số lớp học", reports: "Tổng số report" },
    status: { active: "Hoạt động", pending: "Chờ xử lý" },
    charts: { classStatus: "Trạng thái lớp học (Draft vs Published)", topClasses: "Top 5 lớp học đăng ký nhiều nhất" }
  },
  en: {
    sidebarTitle: "Administrator",
    menu: { dashboard: "Dashboard", students: "Manage Students", instructors: "Manage Instructors", classes: "Manage Classes", categories: "Manage Categories", notifications: "Notifications" },
    cards: { students: "Total Students", instructors: "Total Instructors", classes: "Total Classes", reports: "Total Reports" },
    status: { active: "Active", pending: "Pending" },
    charts: { classStatus: "Class Status (Draft vs Published)", topClasses: "Top 5 Most Enrolled Classes" }
  }
};

const AdminDashboard: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const t = dict[lang];

  const [stats, setStats] = useState({
    totalStudents: 0, totalInstructors: 0, totalClasses: 0, pendingReports: 0, pieChartData: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/dashboard-stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    history.replace('/login');
  };

  const COLORS = ['#3498DB', '#F39C12', '#2ECC71', '#E74C3C'];

  return (
    <IonSplitPane contentId="main-content">

      <IonMenu contentId="main-content" type="overlay">
        <IonContent className="admin-sidebar">
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ color: 'white', fontWeight: 'bold', margin: 0 }}>{t.sidebarTitle}</h2>
          </div>
          <IonList style={{ background: 'transparent', marginTop: '10px' }}>
            
            <IonItem 
              button 
              className={`glass-menu-item ${location.pathname === '/admin-dashboard' ? 'active-menu' : ''}`} 
              onClick={() => history.push('/admin-dashboard')}
            >
              <IonIcon slot="start" icon={gridOutline} />
              <IonLabel>{t.menu.dashboard}</IonLabel>
            </IonItem>

            <IonItem 
              button 
              className={`glass-menu-item ${location.pathname === '/admin-students' ? 'active-menu' : ''}`} 
              onClick={() => history.push('/admin-students')}
            >
              <IonIcon slot="start" icon={peopleOutline} />
              <IonLabel>{t.menu.students}</IonLabel>
            </IonItem>

            <IonItem 
              button 
              className={`glass-menu-item ${location.pathname === '/admin-instructors' ? 'active-menu' : ''}`} 
              onClick={() => history.push('/admin-instructors')}
            >
              <IonIcon slot="start" icon={schoolOutline} />
              <IonLabel>{t.menu.instructors}</IonLabel>
            </IonItem>

            <IonItem 
              button 
              className={`glass-menu-item ${location.pathname === '/admin-classes' ? 'active-menu' : ''}`} 
              onClick={() => history.push('/admin-classes')}
            >
              <IonIcon slot="start" icon={bookOutline} />
              <IonLabel>{t.menu.classes}</IonLabel>
            </IonItem>

            <IonItem 
              button 
              className={`glass-menu-item ${location.pathname === '/admin-categories' ? 'active-menu' : ''}`} 
              onClick={() => history.push('/admin-categories')}
            >
              <IonIcon slot="start" icon={documentTextOutline} />
              <IonLabel>{t.menu.categories}</IonLabel>
            </IonItem>

            <IonItem 
              button 
              className={`glass-menu-item ${location.pathname === '/admin-notifications' ? 'active-menu' : ''}`} 
              onClick={() => history.push('/admin-notifications')}
            >
              <IonIcon slot="start" icon={notificationsOutline} />
              <IonLabel>{t.menu.notifications}</IonLabel>
            </IonItem>

          </IonList>
        </IonContent>
      </IonMenu>

    
      <IonPage id="main-content">
        <IonHeader className="ion-no-border">
          <IonToolbar color="light">
            <IonButtons slot="start"><IonMenuButton /></IonButtons>
            <IonTitle>Dashboard / {t.sidebarTitle}</IonTitle>
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
          <IonGrid>
   
            <IonRow>
              <IonCol size="12" sizeMd="3">
                <IonCard className="card-stats card-green">
                  <IonCardContent className="ion-text-center">
                    <IonIcon icon={schoolOutline} style={{ fontSize: '40px', position: 'absolute', top: 15, left: 15, opacity: 0.5 }}/>
                    <p>{t.cards.students}</p>
                    <h2>{stats.totalStudents}</h2>
                    <div style={{ background: 'rgba(0,0,0,0.1)', padding: '5px', marginTop: '15px' }}>{t.status.active}</div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="12" sizeMd="3">
                <IonCard className="card-stats card-orange">
                  <IonCardContent className="ion-text-center">
                    <IonIcon icon={peopleOutline} style={{ fontSize: '40px', position: 'absolute', top: 15, left: 15, opacity: 0.5 }}/>
                    <p>{t.cards.instructors}</p>
                    <h2>{stats.totalInstructors}</h2>
                    <div style={{ background: 'rgba(0,0,0,0.1)', padding: '5px', marginTop: '15px' }}>{t.status.active}</div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="12" sizeMd="3">
                <IonCard className="card-stats card-blue">
                  <IonCardContent className="ion-text-center">
                    <IonIcon icon={bookOutline} style={{ fontSize: '40px', position: 'absolute', top: 15, left: 15, opacity: 0.5 }}/>
                    <p>{t.cards.classes}</p>
                    <h2>{stats.totalClasses}</h2>
                    <div style={{ background: 'rgba(0,0,0,0.1)', padding: '5px', marginTop: '15px' }}>{t.status.active}</div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="12" sizeMd="3">
                <IonCard className="card-stats card-red">
                  <IonCardContent className="ion-text-center">
                    <IonIcon icon={warningOutline} style={{ fontSize: '40px', position: 'absolute', top: 15, left: 15, opacity: 0.5 }}/>
                    <p>{t.cards.reports}</p>
                    <h2>{stats.pendingReports}</h2>
                    <div style={{ background: 'rgba(0,0,0,0.1)', padding: '5px', marginTop: '15px' }}>{t.status.pending}</div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>

     
            <IonRow>
        
              <IonCol size="12" sizeMd="6">
                <IonCard style={{ borderRadius: '10px', height: '100%' }}>
                  <IonCardContent>
                    <h3 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{t.charts.classStatus}</h3>
                    <div style={{ height: '300px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          
                          <Pie data={stats.pieChartData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="count" nameKey="status" label>
                            {stats.pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>

           
              <IonCol size="12" sizeMd="6">
                <IonCard style={{ borderRadius: '10px', height: '100%' }}>
                  <IonCardContent>
                    <h3 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{t.charts.topClasses}</h3>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
                      
                      <li style={{ marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}><span>1. Lập trình Python</span> <span>520</span></div>
                        <div style={{ width: '100%', background: '#eee', height: '8px', borderRadius: '5px', marginTop: '5px' }}>
                          <div style={{ width: '90%', background: '#3498DB', height: '8px', borderRadius: '5px' }}></div>
                        </div>
                      </li>
                      <li style={{ marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}><span>2. Kỹ năng giao tiếp</span> <span>410</span></div>
                        <div style={{ width: '100%', background: '#eee', height: '8px', borderRadius: '5px', marginTop: '5px' }}>
                          <div style={{ width: '70%', background: '#F39C12', height: '8px', borderRadius: '5px' }}></div>
                        </div>
                      </li>
                      <li style={{ marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}><span>3. Quản lý dự án</span> <span>390</span></div>
                        <div style={{ width: '100%', background: '#eee', height: '8px', borderRadius: '5px', marginTop: '5px' }}>
                          <div style={{ width: '60%', background: '#3498DB', height: '8px', borderRadius: '5px' }}></div>
                        </div>
                      </li>
                    </ul>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>

          </IonGrid>
        </IonContent>
      </IonPage>
    </IonSplitPane>
  );
};

export default AdminDashboard;