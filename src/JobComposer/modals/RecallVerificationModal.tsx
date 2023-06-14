import { BaseModal, Button } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import React from 'react';
import styled from 'styled-components';

type Props = {
  onSubmitHandler: () => void;
  modalTitle?: string;
  onSubmitModalText?: string;
  modalDesc?: string;
};

const Wrapper = styled.div.attrs({})`
  .modal {
    width: 406px;
    .modal-header {
      h2 {
        font-weight: 700;
        font-size: 14px;
      }
    }
  }

  .verification-modal-header {
    display: flex;
    align-items: center;
    padding: 7px 32px 15px;
    margin: 0px -15px;
    justify-content: space-between;
    border-bottom: 1px solid #e0e0e0;

    > .header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      font-weight: 700;
      font-size: 14px;
    }
  }

  .verification-modal-body {
    padding: 16px 20px;
    height: 300px;
    display: flex;

    justify-content: center;
    aligntems: center;
    .description {
      margin-top: 14px;
      font-weight: 400;
      font-size: 14px;
    }
  }

  .verification-modal-footer-buttons {
    display: flex;
    justify-content: flex-end;
  }
`;

const RecallVerificationModal = (props: CommonOverlayProps<Props>) => {
  const {
    props: { onSubmitHandler, modalTitle, onSubmitModalText, modalDesc },
    closeOverlay,
    closeAllOverlays,
  } = props;

  const onSubmitModal = async () => {
    await onSubmitHandler();
    closeOverlay();
  };

  return (
    <Wrapper>
      <BaseModal
        onSecondary={closeOverlay}
        closeModal={closeOverlay}
        closeAllModals={closeAllOverlays}
        showHeader={false}
        showFooter={false}
      >
        <div className="verification-modal-header">
          <div className="header">{modalTitle ? modalTitle : 'Give a reason for the change'}</div>
        </div>
        <div className="verification-modal-body">
          <div className="description">{modalDesc ? modalDesc : 'Write a Description '}</div>
        </div>
        <div className="verification-modal-footer-buttons">
          <Button variant="secondary" color="blue" onClick={closeOverlay}>
            Cancel
          </Button>
          <Button onClick={onSubmitModal}>
            {onSubmitModalText ? onSubmitModalText : 'Submit'}
          </Button>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default RecallVerificationModal;
