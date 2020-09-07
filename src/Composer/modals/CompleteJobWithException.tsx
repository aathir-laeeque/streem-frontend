import { BaseModal } from '#components';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const Wrapper = styled.div`
  .details {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;

    span {
      color: #666666;
      font-size: 16px;
      line-height: 1;

      :first-child {
        margin-bottom: 16px;
      }

      :last-child {
        color: #333333;
        font-weight: 600;
      }
    }
  }

  .reason {
    &-container {
      label {
        color: #666666;
        display: flex;
        font-size: 16px;
        margin-bottom: 8px;
      }
    }

    &-list {
      display: flex;
      flex-wrap: wrap;
    }

    &-item {
      align-content: flex-start;
      box-sizing: bordr-box;
      color: #666666;
      display: flex;
      flex: 0 50%;
      font-size: 16px;
      margin-bottom: 8px;

      .radio-button {
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 100%;
        box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, 0.1),
          inset 0 1.5px 1px 0 rgba(0, 0, 0, 0.15);
        cursor: pointer;
        height: 16px;
        margin-right: 8px;
        width: 16px;
      }
    }
  }

  .remarks {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    margin-top: 24px;

    textarea {
      border: none;
      border-bottom: 1px solid #999999;
      width: 100%;
    }
  }

  .media-upload {
    display: flex;
    flex-direction: column;
    margin-top: 24px;
  }
`;

type CompleteJobWithExceptionModalProps = {
  closeAllModals: () => void;
  closeModal: () => void;
};

const CompleteJobWithExceptionModal: FC<CompleteJobWithExceptionModalProps> = ({
  closeAllModals,
  closeModal,
}) => {
  const dispatch = useDispatch();

  const [values, setValues] = useState({ remarks: '' });

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllModals}
        closeModal={closeModal}
        onPrimary={() => closeModal()}
        onSecondary={() => closeModal()}
        primaryText="Complete Job"
        secondaryText="Go Back"
        title="Completing a Job With Exceptions"
      >
        <div className="details">
          <span>
            You’re about to complete the following job with exceptions:
          </span>
          <span>(31000009-01/2) Fluid Bed Dryer Cleaning Checklist</span>
        </div>

        <div className="reason-container">
          <label>Please select a reason below:</label>

          <div className="reason-list">
            <div className="reason-item">
              <div className="radio-button" />
              <span>Job got canceled</span>
            </div>
            <div className="reason-item">
              <div className="radio-button" />
              <span>Job created by mistake</span>
            </div>
            <div className="reason-item">
              <div className="radio-button" />
              <span>Job completed offline</span>
            </div>
            <div className="reason-item">
              <div className="radio-button" />
              <span>Other</span>
            </div>
          </div>
        </div>

        <div className="remarks">
          <label>Additional Remarks</label>

          <textarea
            value={values.remarks}
            placeholder=""
            rows={3}
            onChange={(e) =>
              setValues((val) => ({ ...val, remarks: e.target.value }))
            }
          />
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default CompleteJobWithExceptionModal;
