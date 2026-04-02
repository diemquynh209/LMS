import React, { useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  IonContent, IonButton, IonIcon, IonSpinner, IonToast,
  IonItem, IonLabel, IonInput, IonTextarea, IonCard, IonCardContent, IonCardHeader, IonCardTitle 
} from '@ionic/react';
import { chevronBackOutline, saveOutline, cloudUploadOutline, documentTextOutline, logoYoutube, checkmarkOutline, hardwareChipOutline } from 'ionicons/icons';
import InstructorLayout from '../../components/InstructorLayout';
import { useLessonEditor } from '../../hooks/instructor/useLessonEditor';
import '../../theme/pages/InstructorClasses.css'; 
import '../../theme/pages/LessonEditor.css'; /* IMPORT FILE CSS MỚI Ở ĐÂY */

const LessonEditor: React.FC = () => {
  const { id: lessonId } = useParams<{ id: string }>();
  const history = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    lessonName, setLessonName, content, setContent, videoUrl, setVideoUrl, documentUrl,
    aiStatus, aiSummary, setAiSummary, approveAISummary, 
    loading, uploading, toastMsg, setToastMsg, saveLessonInfo, uploadDocument
  } = useLessonEditor(lessonId);

  const getFileName = (url: string) => {
    if (!url) return '';
    try {
      const decodedUrl = decodeURIComponent(url);
      const parts = decodedUrl.split('/');
      let fileName = parts[parts.length - 1];

      const prefix = `lesson_${lessonId}_`;
      if (fileName.startsWith(prefix)) {
        fileName = fileName.substring(prefix.length);
      }
      return fileName;
    } catch (error) {
      return 'Tài liệu đính kèm'; 
    }
  };
  
  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadDocument(file);
    }
  };

  return (
    <InstructorLayout pageTitle="Biên soạn Bài học">
      <div className="lesson-editor-wrapper">
        
        {/* Header */}
        <div className="lesson-editor-header">
          <IonButton fill="clear" color="medium" onClick={() => history.goBack()} style={{ margin: 0 }}>
            <IonIcon slot="start" icon={chevronBackOutline} /> Quay lại
          </IonButton>
          <IonButton color="primary" onClick={saveLessonInfo}>
            <IonIcon slot="start" icon={saveOutline} /> LƯU THAY ĐỔI
          </IonButton>
        </div>

        {loading ? (
          <div className="center-spinner"><IonSpinner name="dots" /></div>
        ) : (
          <>
            {/* Nội dung bài học */}
            <IonCard className="editor-card">
              <IonCardHeader className="editor-card-header">
                <IonCardTitle className="editor-card-title">Nội dung bài học</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="editor-card-content">
                <IonItem className="modal-form-item">
                  <IonLabel position="stacked">Tên bài học <span className="text-red">*</span></IonLabel>
                  <IonInput value={lessonName} onIonInput={e => setLessonName(e.detail.value!)} placeholder="Nhập tên bài..." />
                </IonItem>
                <IonItem className="modal-form-item" style={{ marginBottom: 0 }}>
                  <IonLabel position="stacked">Hướng dẫn học tập (Mô tả)</IonLabel>
                  <IonTextarea value={content} onIonInput={e => setContent(e.detail.value!)} placeholder="VD: Các em xem video và tải tài liệu bên dưới nhé..." rows={5} />
                </IonItem>
              </IonCardContent>
            </IonCard>

            {/* Video & Tài liệu */}
            <IonCard className="editor-card">
              <IonCardHeader className="editor-card-header">
                <IonCardTitle className="editor-card-title">Đa phương tiện</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="editor-card-content">
                
                <IonItem className="modal-form-item mb-20">
                  <IonIcon icon={logoYoutube} slot="start" color="danger" />
                  <IonLabel position="stacked">Link Video YouTube (Không bắt buộc)</IonLabel>
                  <IonInput value={videoUrl} onIonInput={e => setVideoUrl(e.detail.value!)} placeholder="Dán link video từ YouTube vào đây..." type="url" />
                </IonItem>

                <div className="upload-zone">
                  <IonIcon icon={documentTextOutline} className="upload-icon" />
                  <h4 className="upload-title">Tài liệu đính kèm (PDF, Word, Slide)</h4>
                  
                  {documentUrl && (
                    <div className="upload-success-box">
                      <a href={documentUrl} target="_blank" rel="noreferrer" className="upload-success-link">
                        ✅ Đã tải lên tài liệu: {getFileName(documentUrl)} <br/> (Nhấn để xem)
                      </a>
                    </div>
                  )}

                  <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                  
                  <IonButton color="primary" fill="outline" onClick={handleTriggerUpload} disabled={uploading}>
                    <IonIcon slot="start" icon={cloudUploadOutline} />
                    {uploading ? 'ĐANG TẢI LÊN...' : (documentUrl ? 'TẢI FILE KHÁC LÊN' : 'CHỌN FILE TẢI LÊN')}
                  </IonButton>
                  {uploading && <p className="upload-hint">Quá trình này có thể mất vài giây...</p>}
                </div>
              </IonCardContent>
            </IonCard>

            {/* Tóm tắt AI */}
            {aiStatus !== 'none' && (
              <IonCard className={`ai-card ${aiStatus === 'pending_review' ? 'pending-review' : ''}`}>
                <IonCardHeader className="editor-card-header">
                  <IonCardTitle className="ai-card-title">
                    <IonIcon icon={hardwareChipOutline} color="secondary" />
                    Tóm tắt tài liệu bằng AI
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent className="editor-card-content">
                  
                  {aiStatus === 'processing' && (
                    <div className="ai-processing-box">
                      <IonSpinner name="dots" className="mr-15" />
                      <span style={{ fontSize: '15px' }}>Hệ thống AI đang tiến hành đọc và tóm tắt tài liệu. Vui lòng tải lại trang sau ít phút...</span>
                    </div>
                  )}

                  {aiStatus === 'pending_review' && (
                    <div className="ai-pending-box">
                      <p className="ai-alert-text">
                        ⚠️ AI đã tóm tắt xong! Giảng viên vui lòng kiểm tra, chỉnh sửa (nếu cần) và ấn Duyệt.
                      </p>
                      
                      <div className="ai-textarea-wrapper">
                        <IonTextarea 
                          rows={8} 
                          value={aiSummary} 
                          onIonInput={(e) => setAiSummary(e.detail.value!)}
                          className="ai-textarea"
                        />
                      </div>

                      <IonButton color="success" expand="block" className="mt-15" onClick={approveAISummary}>
                        <IonIcon slot="start" icon={checkmarkOutline} /> 
                        DUYỆT BẢN TÓM TẮT NÀY
                      </IonButton>
                    </div>
                  )}

                  {aiStatus === 'published' && (
                    <div className="ai-published-box">
                      <p className="ai-success-text">
                        ✅ Đã xuất bản tóm tắt cho học sinh.
                      </p>
                      <div className="ai-textarea-wrapper published">
                        <IonTextarea 
                          rows={6} 
                          value={aiSummary} 
                          onIonInput={(e) => setAiSummary(e.detail.value!)} 
                          className="ai-textarea"
                        />
                      </div>
                      <IonButton color="primary" fill="outline" className="mt-15" onClick={approveAISummary}>
                        <IonIcon slot="start" icon={saveOutline} />
                        CẬP NHẬT LẠI TÓM TẮT
                      </IonButton>
                    </div>
                  )}

                </IonCardContent>
              </IonCard>
            )}

          </>
        )}
      </div>

      <IonToast isOpen={!!toastMsg} message={toastMsg} duration={3000} onDidDismiss={() => setToastMsg('')} />
    </InstructorLayout>
  );
};

export default LessonEditor;