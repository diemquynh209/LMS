import { useState } from 'react';
import { useIonViewWillEnter } from '@ionic/react';

export const useAdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [toastMsg, setToastMsg] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      setToastMsg('Lỗi kết nối đến server!');
    }
  };

  useIonViewWillEnter(() => { fetchCategories(); });

  const handleCreate = async (name: string, desc: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/categories', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_name: name, description: desc })
      });
      const data = await response.json();
      if (response.ok) { setToastMsg('Thêm danh mục thành công!'); fetchCategories(); return true; }
      else { setToastMsg(data.message); return false; }
    } catch (e) { setToastMsg('Lỗi kết nối'); return false; }
  };

  const handleUpdate = async (id: number, name: string, desc: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/categories/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_name: name, description: desc })
      });
      if (response.ok) { setToastMsg('Cập nhật thành công!'); fetchCategories(); return true; }
      else { setToastMsg('Lỗi cập nhật!'); return false; }
    } catch (e) { setToastMsg('Lỗi kết nối'); return false; }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Xóa danh mục "${name}"? Các lớp học thuộc danh mục này sẽ bị trống danh mục.`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/categories/${id}`, { method: 'DELETE' });
        if (response.ok) { setToastMsg('Xóa thành công!'); fetchCategories(); }
      } catch (e) { setToastMsg('Lỗi kết nối'); }
    }
  };

  return { categories, fetchCategories, handleCreate, handleUpdate, handleDelete, toastMsg, setToastMsg };
};