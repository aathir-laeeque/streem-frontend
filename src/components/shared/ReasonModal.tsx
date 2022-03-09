import { BaseModal, Button1 } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { TextareaAutosize } from '@material-ui/core';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Error } from '#utils/globalTypes';
import { Error as ErrorIcon } from '@material-ui/icons';

const Wrapper = styled.div`
  .modal {
    .close-icon {
      color: #e0e0e0 !important;
      font-size: 16px !important;
      top: 19px !important;
    }
    .modal-header {
      border-bottom: 1px solid #f4f4f4 !important;
      h2 {
        color: #161616 !important;
        font-weight: bold !important;
        font-size: 14px !important;
      }
    }
    .modal-body {
      padding: 0px !important;

      .reason-modal-form-body {
        padding: 16px;

        .reason-modal-desc {
          color: #525252;
          font-size: 12px;
          text-align: start;
          margin-bottom: 8px;
        }

        .reason-modal-input {
          max-height: 168px;
          background-color: #f4f4f4;
          border: none;
          border-bottom: 1px solid #cccccc;
          min-width: 100%;
          max-width: 100%;
          padding: 11px 16px;
        }

        .inline-form-error {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding-top: 8px;
          color: #eb5757;
          font-size: 12px;

          .error-icon {
            font-size: 15px;
            margin-right: 4px;
          }
        }
      }

      .reason-modal-footer {
        border-top: 1px solid #f4f4f4 !important;
        display: flex;
        align-items: center;
        padding: 16px;
        justify-content: flex-end;
      }
    }
  }
`;

type Props = {
  onSumbitHandler: (
    reason: string,
    setFormErrors: (errors?: Error[]) => void,
  ) => void;
  modalTitle?: string;
  onSubmitModalText?: string;
  modalDesc?: string;
};

const ReasonModal = (props: CommonOverlayProps<Props>) => {
  const {
    props: { onSumbitHandler, modalTitle, onSubmitModalText, modalDesc },
    closeOverlay,
    closeAllOverlays,
  } = props;
  const [reasonTextIsEmpty, setReasonTextIsEmpty] = useState<boolean>(true);
  const [reason, setReason] = useState<string>('');
  const [formError, setFormError] = useState<Error | undefined>();

  const getApiFormErrors = (errors?: Error[]) => {
    if (errors && errors.length) {
      setFormError(errors[0]);
    } else {
      closeOverlay();
    }
  };

  const onSubmitModal = async () => {
    if (!reasonTextIsEmpty) {
      await onSumbitHandler(reason, getApiFormErrors);
    }
  };

  return (
    <Wrapper>
      <BaseModal
        onSecondary={closeOverlay}
        closeModal={closeOverlay}
        closeAllModals={closeAllOverlays}
        title={modalTitle ? modalTitle : 'Give a reason for the change'}
        disabledPrimary={reasonTextIsEmpty}
        showFooter={false}
      >
        <div className="reason-modal-form-body">
          <div className="reason-modal-desc">
            {modalDesc
              ? modalDesc
              : 'The reason provided here will be useful for future reconciliation purposes and will be displayed in the audit logs'}
          </div>

          <TextareaAutosize
            className="reason-modal-input"
            placeholder="Write here"
            minRows={4}
            maxRows={8}
            onChange={debounce((e) => {
              if (e.target.value.trim() !== '') {
                setReason(e.target.value);
                setReasonTextIsEmpty(false);
                setFormError(undefined);
              } else {
                setReasonTextIsEmpty(true);
              }
            })}
          />
          {!!formError && (
            <div className="inline-form-error">
              <ErrorIcon className="error-icon" />
              <span>{formError.message}</span>
            </div>
          )}
        </div>
        <div className="reason-modal-footer">
          <Button1 variant="secondary" onClick={() => closeOverlay()}>
            Cancel
          </Button1>
          <Button1
            color="red"
            onClick={onSubmitModal}
            disabled={reasonTextIsEmpty}
          >
            {onSubmitModalText ? onSubmitModalText : 'Submit'}
          </Button1>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default ReasonModal;
