import { BaseModal } from '#components';
import React, { FC } from 'react';
import styled from 'styled-components';

export interface ConfirmationModalProps {
  closeAllModals: () => void;
  closeModal: () => void;
  onPrimary: () => void;
  primaryText?: string;
  secondaryText?: string;
  title?: string;
  body?: JSX.Element;
}

const Wrapper = styled.div.attrs({})`
  .modal {
    min-width: 360px !important;
    border-radius: 8px !important;

    h2 {
      font-size: 24px !important;
    }
    .close-icon {
      font-size: 32px !important;
      color: #999999 !important;
    }
    .modal-header {
      border-bottom: 1px solid #dadada !important;
    }
    .modal-footer {
      border-bottom: 1px solid #dadada !important;
    }

    .modal-body {
      text-align: left !important;
    }

    .body-content {
      font-size: 16px;
      color: #666666;
    }
  }
`;

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
  closeAllModals,
  closeModal,
  onPrimary,
  primaryText = 'Ok',
  secondaryText = 'Cancel',
  title,
  body,
}) => {
  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllModals}
        closeModal={closeModal}
        onSecondary={closeModal}
        title={title}
        primaryText={primaryText}
        secondaryText={secondaryText}
        onPrimary={() => {
          onPrimary();
          closeModal();
        }}
      >
        {body && body}
        <div className="body-content" style={{ marginTop: '30px' }}>
          Are you sure you want to continue?
        </div>
      </BaseModal>
    </Wrapper>
  );
};
