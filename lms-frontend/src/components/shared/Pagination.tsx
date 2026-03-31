import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const maxVisiblePages = 5; 

  const currentGroup = Math.ceil(currentPage / maxVisiblePages); 
  const startPage = (currentGroup - 1) * maxVisiblePages + 1;
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', gap: '5px' }}>
      
      <IonButton 
        fill="clear" 
        color="medium"
        disabled={currentPage === 1} 
        onClick={() => onPageChange(currentPage - 1)}
      >
        <IonIcon icon={chevronBackOutline} />
      </IonButton>

      {pages.map(page => {
        const isActive = currentPage === page;
        return (
          <IonButton
            key={page}
            fill="clear"
            style={{ 
              '--border-radius': '6px', 
              width: '35px', 
              height: '35px',
              margin: '0 2px',
              fontWeight: isActive ? 'bold' : 'normal',
              '--background': isActive ? '#8a94a6' : '#f1f3f5', 
              '--color': isActive ? '#ffffff' : '#495057',      
              '--box-shadow': 'none'
            }}
            onClick={() => onPageChange(page)}
          >
            {page}
          </IonButton>
        );
      })}

      <IonButton 
        fill="clear" 
        color="medium"
        disabled={currentPage === totalPages} 
        onClick={() => onPageChange(currentPage + 1)}
      >
        <IonIcon icon={chevronForwardOutline} />
      </IonButton>

    </div>
  );
};

export default Pagination;