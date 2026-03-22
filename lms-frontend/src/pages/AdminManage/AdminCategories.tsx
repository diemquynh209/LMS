import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { 
  IonButton, IonIcon, IonToast, IonModal, IonHeader, 
  IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonTextarea 
} from '@ionic/react';
import { trashOutline, createOutline, addCircleOutline } from 'ionicons/icons';
import { useAdminCategories } from '../../hooks/admin/useAdminCategories';

const AdminCategories: React.FC = () => {
  const { categories, handleCreate, handleUpdate, handleDelete, toastMsg, setToastMsg } = useAdminCategories();
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  const openModal = (category: any = null) => {
    if (category) {
      setEditingId(category.category_id);
      setCatName(category.category_name);
      setCatDesc(category.description || '');
    } else {
      setEditingId(null);
      setCatName('');
      setCatDesc('');
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!catName.trim()) { setToastMsg('Vui lòng nhập tên danh mục!'); return; }
    
    let success = false;
    if (editingId) success = await handleUpdate(editingId, catName, catDesc);
    else success = await handleCreate(catName, catDesc);
    
    if (success) setShowModal(false);
  };

  return (
    <AdminLayout pageTitle="Quản Lý Danh Mục">
      <div style={{ padding: '20px', paddingBottom: '80px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontWeight: 'bold' }}>Danh mục Lớp học</h2>
          
          <IonButton color="primary" onClick={() => openModal()}>
            <IonIcon slot="start" icon={addCircleOutline} /> THÊM DANH MỤC
          </IonButton>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Danh Mục</th>
                <th>Mô tả</th>

                <th>Các lớp trực thuộc</th>
                <th style={{ textAlign: 'center' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {categories?.map((cat) => (
                <tr key={cat.category_id}>
                  <td>#{cat.category_id}</td>
                  <td style={{ fontWeight: 'bold' }}>{cat.category_name}</td>
                  <td>{cat.description || 'Không có mô tả'}</td>
                  
                  <td style={{ maxWidth: '300px' }}>
                    {cat.classes ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {cat.classes.split(',').map((className: string, index: number) => (
                          <span key={index} style={{
                            background: '#f3e5f5', color: '#7b1fa2', padding: '3px 8px', 
                            borderRadius: '12px', fontSize: '12px', border: '1px solid #e1bee7'
                          }}>
                            {className.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#999', fontStyle: 'italic' }}>Chưa có lớp học</span>
                    )}
                  </td>

                  <td>
                    <div className="action-td-container">
                      <IonButton className="action-btn" color="warning" fill="clear" onClick={() => openModal(cat)} title="Sửa">
                        <IonIcon slot="icon-only" icon={createOutline} />
                      </IonButton>
                      <IonButton className="action-btn" color="danger" fill="clear" onClick={() => handleDelete(cat.category_id, cat.category_name)} title="Xóa">
                        <IonIcon slot="icon-only" icon={trashOutline} />
                      </IonButton>
                    </div>
                  </td>
                </tr>
              ))}
              {categories?.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '30px' }}>Chưa có danh mục nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} breakpoints={[0, 0.5, 0.8]} initialBreakpoint={0.5}>
        <IonHeader>
          <IonToolbar color="light">
            <IonTitle>{editingId ? 'Sửa Danh Mục' : 'Thêm Danh Mục Mới'}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem style={{ marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <IonLabel position="stacked">Tên danh mục <span style={{ color: 'red' }}>*</span></IonLabel>
            <IonInput value={catName} onIonInput={e => setCatName(e.detail.value!)} placeholder="VD: Lập trình Python..." />
          </IonItem>

          <IonItem style={{ marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <IonLabel position="stacked">Mô tả (Không bắt buộc)</IonLabel>
            <IonTextarea value={catDesc} onIonInput={e => setCatDesc(e.detail.value!)} placeholder="Nhập mô tả..." rows={4} />
          </IonItem>

          <div style={{ display: 'flex', gap: '10px' }}>
            <IonButton expand="block" color="medium" fill="outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>HỦY BỎ</IonButton>
            <IonButton expand="block" color="primary" style={{ flex: 1 }} onClick={handleSave}>LƯU LẠI</IonButton>
          </div>
        </IonContent>
      </IonModal>

      <IonToast isOpen={!!toastMsg} message={toastMsg} duration={3000} onDidDismiss={() => setToastMsg('')} />
    </AdminLayout>
  );
};

export default AdminCategories;