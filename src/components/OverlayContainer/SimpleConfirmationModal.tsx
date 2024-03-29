import { BaseModal, Button } from '#components';
import React, { FC } from 'react';
import styled from 'styled-components';

import { CommonOverlayProps } from './types';

const Wrapper = styled.div`
  .modal {
    min-width: 400px !important;
    padding: 16px;

    &-body {
      padding: 0 !important;
    }
  }

  .header {
    color: #000000;
    display: flex;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
  }

  .body {
    display: flex;
    flex-direction: column;

    span {
      color: #000000;
      font-size: 14px;
      margin-bottom: 8px;
      text-align: left;

      :last-of-type {
        margin-bottom: 0;
      }
    }

    .buttons-container {
      display: flex;
      margin-top: 24px;
    }
  }
`;

type Props = {
  header: string;
  body: string;
  onPrimaryClick: () => void;
};

const SimpleConfirmationModal: FC<CommonOverlayProps<Props>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { header, body, onPrimaryClick },
}) => {
  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        showHeader={false}
        showFooter={false}
      >
        <div className="header">{header}</div>
        <div className="body">
          {typeof body === 'object' ? body : <span>{body}</span>}

          <div className="buttons-container">
            <Button variant="secondary" color="red" onClick={closeOverlay}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onPrimaryClick();
                closeOverlay();
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default SimpleConfirmationModal;
