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
    min-width: 400px !important;

    h2 {
      color: #000 !important;
      font-weight: bold !important;
    }

    .modal-header {
      padding: 24px !important;
      border-bottom: none !important;
    }

    .modal-footer {
      padding: 24px 16px !important;
      flex-direction: row-reverse !important;
      border-top: none !important;

      .modal-footer-options {
        padding: 0px 16px !important;

        span {
          padding: 3px 8px;
        }
      }

      .modal-footer-buttons {
        padding: 0px 8px !important;
      }
    }

    .modal-body {
      padding: 0px 24px !important;
      font-size: 14px;
      color: #000000;
    }
  }
`;

export const ConfirmationModal: FC<CommonOverlayProps<ConfirmationModalProps>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { onPrimary, primaryText = 'Ok', secondaryText = 'Cancel', title, body },
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
      </BaseModal>
    </Wrapper>
  );
};
