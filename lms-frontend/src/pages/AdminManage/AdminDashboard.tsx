import React from 'react';
import { IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonIcon } from '@ionic/react';
import { schoolOutline, peopleOutline, bookOutline, warningOutline } from 'ionicons/icons';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAdminDashboard } from '../../hooks/admin/useAdminDashboard'; 
import AdminLayout from '../../components/AdminLayout';

const AdminDashboard: React.FC = () => {
  const { t, stats } = useAdminDashboard(); 

  const STATUS_COLORS: { [key: string]: string } = {
    'Published': '#2ECC71', 
    'Draft': '#F39C12', 
    'Closed': '#E74C3C'  
  };

  return (
    <AdminLayout pageTitle="Quản lý chung">
      <div style={{ padding: '20px', paddingBottom: '80px' }}>
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
            {/* Biểu đồ Tròn */}
            <IonCol size="12" sizeMd="6">
              <IonCard style={{ borderRadius: '10px', height: '100%' }}>
                <IonCardContent>
                  <h3 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{t.charts.classStatus}</h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={stats.pieChartData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="count" nameKey="status" label>
                          {stats.pieChartData?.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#BDC3C7'} />
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

            {/* Danh sách Top 5 Khóa học */}
            <IonCol size="12" sizeMd="6">
              <IonCard style={{ borderRadius: '10px', height: '100%' }}>
                <IonCardContent>
                  <h3 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{t.charts.topClasses}</h3>
                  <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
                    {stats.topClasses && stats.topClasses.length > 0 ? (
                      stats.topClasses.map((cls: any, index: number) => {
                        const maxCount = (stats.topClasses[0] as any).student_count || 1; 
                        const percent = (cls.student_count / maxCount) * 100;
                        const barColors = ['#3498DB', '#F39C12', '#2ECC71', '#9B59B6', '#E74C3C'];
                        
                        return (
                          <li key={index} style={{ marginBottom: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>
                                {index + 1}. {cls.class_name}
                              </span> 
                              <span>{cls.student_count}</span>
                            </div>
                            <div style={{ width: '100%', background: '#eee', height: '8px', borderRadius: '5px', marginTop: '5px' }}>
                              <div style={{ 
                                width: `${percent}%`, 
                                background: barColors[index % barColors.length], 
                                height: '8px', 
                                borderRadius: '5px',
                                transition: 'width 1s ease-in-out'
                              }}></div>
                            </div>
                          </li>
                        );
                      })
                    ) : (
                      <li style={{ textAlign: 'center', color: '#999', padding: '20px' }}>Chưa có dữ liệu lớp học.</li>
                    )}
                  </ul>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;