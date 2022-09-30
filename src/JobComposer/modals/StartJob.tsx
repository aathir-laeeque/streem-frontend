import { BaseModal, Button } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { Job } from '#views/Jobs/ListView/types';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { startJob } from '../actions';

const Wrapper = styled.div`
  .modal {
    min-width: 400px !important;
    padding: 24px;

    &-body {
      padding: 0 !important;
    }
  }

  .start-job {
    display: flex;
    flex-direction: column;
    width: 400px;
    padding: 16px 40px;

    .header {
      color: #000000;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 16px;
    }

    .body {
      color: #000000;
      font-size: 14px;
    }
  }

  .start-job-actions {
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
  }
`;

const StartJobModal: FC<
  CommonOverlayProps<{
    jobId: Job['id'];
  }>
> = ({ closeAllOverlays, closeOverlay, props: { jobId } }) => {
  const dispatch = useDispatch();

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        showHeader={false}
        showFooter={false}
      >
        {jobId ? (
          <div className="start-job-actions">
            <div className="header">Start Job</div>
            <div className="body">
              <span>Once the Job Starts it cannot be Stopped</span>
              <span>Are you sure you want to Start Job?</span>

              <div className="buttons-container">
                <Button variant="secondary" color="red" onClick={() => closeOverlay()}>
                  Cancel
                </Button>
                <Button onClick={() => dispatch(startJob(jobId))}>Confirm</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="start-job">
            <div className="header">Press Start Job</div>
            <div className="body">
              You need to press Start Job button in order to begin your tasks
            </div>
          </div>
        )}
      </BaseModal>
    </Wrapper>
  );
};

export default StartJobModal;
