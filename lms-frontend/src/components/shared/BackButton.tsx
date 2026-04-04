import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

interface BackButtonProps {
  text?: string;
  style?: React.CSSProperties;
}

const BackButton: React.FC<BackButtonProps> = ({ text = 'QUAY LẠI', style }) => {
  const history = useHistory();

  return (
    <IonButton 
      fill="clear" 
      color="medium" 
      onClick={() => history.goBack()} 
      style={{ margin: 0, '--padding-start': '0', fontSize: '14px', ...style }}
    >
      <IonIcon slot="start" icon={chevronBackOutline} /> {text}
    </IonButton>
  );
};

export default BackButton;