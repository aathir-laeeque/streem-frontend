import { BaseModal } from '#components';
import React, { FC } from 'react';
import styled from 'styled-components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';

export interface ConfirmationModalProps {
  onPrimary: () => void;
  primaryText?: string;
  secondaryText?: string;
  title?: string;
  body?: JSX.Element;
}

const Wrapper = styled.div.attrs({})`
  .modal {
    min-width: 360px !important;

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

export const ConfirmationModal: FC<CommonOverlayProps<
  ConfirmationModalProps
>> = ({
  closeAllOverlays,
  closeOverlay,
  props: {
    onPrimary,
    primaryText = 'Ok',
    secondaryText = 'Cancel',
    title,
    body,
  },
}) => {
  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        onSecondary={closeOverlay}
        title={title}
        primaryText={primaryText}
        secondaryText={secondaryText}
        onPrimary={() => {
          onPrimary();
          closeOverlay();
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
