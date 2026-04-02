import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  IonContent, IonButton, IonIcon, IonSpinner, IonToast,
  IonModal, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel, IonInput,
  IonReorderGroup, IonReorder, ItemReorderEventDetail
} from '@ionic/react';
import { addOutline, createOutline, trashOutline, chevronBackOutline, listOutline, playCircleOutline } from 'ionicons/icons';
import InstructorLayout from '../../components/InstructorLayout';
import { useCourseBuilder, Chapter } from '../../hooks/instructor/useCourseBuilder';
import '../../theme/pages/CourseBuilder.css';
import '../../theme/pages/InstructorClasses.css'; 

const CourseBuilder: React.FC = () => {
  const { id: classId } = useParams<{ id: string }>();
  const history = useHistory();
  
  const { 
    chapters, setChapters, loading, toastMsg, setToastMsg,
    createChapter, updateChapter, deleteChapter, reorderChaptersAPI,
    createLesson, deleteLesson, reorderLessonsAPI
  } = useCourseBuilder(classId);

  // States
  const [showChapModal, setShowChapModal] = useState(false);
  const [editingChapId, setEditingChapId] = useState<number | null>(null);
  const [chapName, setChapName] = useState('');

  const [showLessModal, setShowLessModal] = useState(false);
  const [targetChapId, setTargetChapId] = useState<number | null>(null);
  const [lessName, setLessName] = useState('');

  // Mở Modal Thêm/Sửa Chương
  const openChapModal = (chap: Chapter | null = null) => {
    if (chap) {
      setEditingChapId(chap.chapter_id);
      setChapName(chap.chapter_name);
    } else {
      setEditingChapId(null);
      setChapName('');
    }
    setShowChapModal(true);
  };

  const handleSaveChapter = async () => {
    if (!chapName.trim()) { setToastMsg('Vui lòng nhập tên chương!'); return; }
    let success;
    if (editingChapId) success = await updateChapter(editingChapId, chapName);
    else success = await createChapter(chapName);
    
    if (success) setShowChapModal(false);
  };

  const openLessModal = (chapterId: number) => {
    setTargetChapId(chapterId);
    setLessName('');
    setShowLessModal(true);
  };

  const handleSaveLesson = async () => {
    if (!lessName.trim() || !targetChapId) { setToastMsg('Vui lòng nhập tên bài học!'); return; }
    const success = await createLesson(targetChapId, lessName);
    if (success) setShowLessModal(false);
  };

  // Xử lý kéo thả CHƯƠNG
  const handleReorderChapters = (event: CustomEvent<ItemReorderEventDetail>) => {
    const fromIndex = event.detail.from;
    const toIndex = event.detail.to;
    
    const newChapters = [...chapters];
    const draggedItem = newChapters.splice(fromIndex, 1)[0];
    newChapters.splice(toIndex, 0, draggedItem);
    
    event.detail.complete(); 
    reorderChaptersAPI(newChapters);
  };

  // Xử lý kéo thả BÀI HỌC
  const handleReorderLessons = (event: CustomEvent<ItemReorderEventDetail>, chapterIndex: number) => {
    event.stopPropagation(); // Chặn lan sự kiện lên chương

    const fromIndex = event.detail.from;
    const toIndex = event.detail.to;

    const newChapters = [...chapters];
    const newLessons = [...newChapters[chapterIndex].lessons]; // Tránh lỗi UI React
    
    const draggedLesson = newLessons.splice(fromIndex, 1)[0];
    newLessons.splice(toIndex, 0, draggedLesson);
    
    newChapters[chapterIndex] = {
      ...newChapters[chapterIndex],
      lessons: newLessons
    };
    
    event.detail.complete();
    reorderLessonsAPI(newChapters);
  };

  return (
    <InstructorLayout pageTitle="Khung chương trình">
      <div className="builder-container">
        
        <div className="builder-header builder-header-flex">
          <IonButton fill="clear" color="medium" onClick={() => history.goBack()} style={{ margin: 0 }}>
            <IonIcon slot="start" icon={chevronBackOutline} /> Quay lại
          </IonButton>
          
          <IonButton color="primary" onClick={() => openChapModal()}>
            <IonIcon slot="start" icon={addOutline} /> THÊM CHƯƠNG
          </IonButton>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}><IonSpinner name="crescent" /></div>
        ) : chapters.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
            <IonIcon icon={listOutline} style={{ fontSize: '50px', opacity: 0.5 }} />
            <p>Chưa có chương nào. Hãy tạo chương đầu tiên!</p>
          </div>
        ) : (
          
          <IonReorderGroup disabled={false} onIonItemReorder={handleReorderChapters}>
            {chapters.map((chap, chapIndex) => (
              <div key={chap.chapter_id} className="chapter-card">
                
                <div className="chapter-header">
                  <div className="chapter-title-wrapper">
                    <IonReorder className="reorder-handle"><IonIcon icon={listOutline} /></IonReorder>
                    <h3 className="chapter-title">Chương {chapIndex + 1}: {chap.chapter_name}</h3>
                  </div>
                  
                  <div>
                    <IonButton fill="clear" color="primary" onClick={() => openChapModal(chap)}><IonIcon slot="icon-only" icon={createOutline} /></IonButton>
                    <IonButton fill="clear" color="danger" onClick={() => deleteChapter(chap.chapter_id, chap.chapter_name)}><IonIcon slot="icon-only" icon={trashOutline} /></IonButton>
                  </div>
                </div>

                <div className="lesson-list">
                  <IonReorderGroup 
                    disabled={false} 
                    onIonItemReorder={(e) => handleReorderLessons(e, chapIndex)}
                    onPointerDown={(e) => e.stopPropagation()} /* Chặn xung đột với Chương */
                  >
                    {chap.lessons.map((lesson, lessIndex) => (
                      <div key={lesson.lesson_id} className="lesson-item">
                        <div className="lesson-title-wrapper">
                          <IonReorder className="reorder-handle"><IonIcon icon={listOutline} style={{ fontSize: '16px' }} /></IonReorder>
                          <IonIcon icon={playCircleOutline} color="medium" />
                          <span className="lesson-title">Bài {lessIndex + 1}: {lesson.lesson_name}</span>
                        </div>
                        <div>
                          <IonButton fill="clear" color="primary" size="small" onClick={() => history.push(`/instructor/lesson-editor/${lesson.lesson_id}`)}>Biên soạn</IonButton>
                          <IonButton fill="clear" color="danger" size="small" onClick={() => deleteLesson(lesson.lesson_id, lesson.lesson_name)}><IonIcon slot="icon-only" icon={trashOutline} /></IonButton>
                        </div>
                      </div>
                    ))}
                  </IonReorderGroup>
                </div>

                <IonButton fill="clear" className="btn-add-lesson" onClick={() => openLessModal(chap.chapter_id)}>
                  <IonIcon slot="start" icon={addOutline} /> THÊM BÀI HỌC
                </IonButton>

              </div>
            ))}
          </IonReorderGroup>
        )}
      </div>

      {/* CHAPTER MODAL */}
      <IonModal isOpen={showChapModal} onDidDismiss={() => setShowChapModal(false)} breakpoints={[0, 0.4]} initialBreakpoint={0.4}>
        <IonHeader><IonToolbar color="light"><IonTitle>{editingChapId ? 'Sửa tên Chương' : 'Thêm Chương Mới'}</IonTitle></IonToolbar></IonHeader>
        <IonContent className="ion-padding">
          <IonItem className="modal-form-item mb-20">
            <IonLabel position="stacked">Tên chương <span className="required-asterisk">*</span></IonLabel>
            <IonInput value={chapName} onIonInput={e => setChapName(e.detail.value!)} placeholder="VD: Mở đầu, Các khái niệm cơ bản..." />
          </IonItem>
          <div className="modal-btn-group">
            <IonButton expand="block" color="medium" fill="outline" className="modal-btn-flex" onClick={() => setShowChapModal(false)}>HỦY</IonButton>
            <IonButton expand="block" color="primary" className="modal-btn-flex" onClick={handleSaveChapter}>LƯU LẠI</IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* LESSON MODAL */}
      <IonModal isOpen={showLessModal} onDidDismiss={() => setShowLessModal(false)} breakpoints={[0, 0.4]} initialBreakpoint={0.4}>
        <IonHeader><IonToolbar color="light"><IonTitle>Thêm Bài Học Mới</IonTitle></IonToolbar></IonHeader>
        <IonContent className="ion-padding">
          <IonItem className="modal-form-item mb-20">
            <IonLabel position="stacked">Tên bài học <span className="required-asterisk">*</span></IonLabel>
            <IonInput value={lessName} onIonInput={e => setLessName(e.detail.value!)} placeholder="VD: Cài đặt môi trường..." />
          </IonItem>
          <div className="modal-btn-group">
            <IonButton expand="block" color="medium" fill="outline" className="modal-btn-flex" onClick={() => setShowLessModal(false)}>HỦY</IonButton>
            <IonButton expand="block" color="primary" className="modal-btn-flex" onClick={handleSaveLesson}>THÊM BÀI HỌC</IonButton>
          </div>
        </IonContent>
      </IonModal>

      <IonToast isOpen={!!toastMsg} message={toastMsg} duration={3000} onDidDismiss={() => setToastMsg('')} />
    </InstructorLayout>
  );
};

export default CourseBuilder;