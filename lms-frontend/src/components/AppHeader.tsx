import React from 'react';
import { 
  IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton 
} from '@ionic/react';

interface AppHeaderProps {
  title: string;                 
  showBackButton?: boolean;      
  backDefaultHref?: string;      
  rightContent?: React.ReactNode; 
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  title, 
  showBackButton = false, 
  backDefaultHref = '/dashboard',
  rightContent 
}) => {
  return (
    <IonHeader className="ion-no-border">
      <IonToolbar className="glass-toolbar">
        
        {showBackButton && (
          <IonButtons slot="start">
            <IonBackButton defaultHref={backDefaultHref} text="Quay lại" className="white-text-btn" />
          </IonButtons>
        )}

        <IonTitle>{title}</IonTitle>
        {rightContent && (
          <IonButtons slot="end">
            {rightContent}
          </IonButtons>
        )}

      </IonToolbar>
    </IonHeader>
  );
};

export default AppHeader;