import { BaseModal } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { Entity } from '#JobComposer/composer.types';
import { startPollActiveStageData, stopPollActiveStageData } from '#JobComposer/StageList/actions';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { fetchData, resetComposer } from '../actions';

export enum RefetchJobErrorType {
  JOB = 'JOB',
  TASK = 'TASK',
  ACTIVITY = 'ACTIVITY',
}

const Wrapper = styled.div`
  .modal {
    .modal-header {
      border-bottom: 1px solid #f4f4f4 !important;
      h2 {
        color: #161616 !important;
        font-weight: bold !important;
        font-size: 14px !important;
      }
    }

    .modal-body {
      color: #525252;
      font-size: 14px;
      text-align: start;
    }

    .modal-footer {
      border-top: 1px solid #f4f4f4 !important;
    }
  }
`;

const RefetchJobComposerData: FC<
  CommonOverlayProps<{
    modalTitle: string;
    jobId: string;
    errorType: RefetchJobErrorType;
  }>
> = ({ closeOverlay, closeAllOverlays, props: { modalTitle, jobId, errorType } }) => {
  const dispatch = useDispatch();

  return (
    <Wrapper>
      <BaseModal
        showSecondary={false}
        allowCloseOnOutsideClick={false}
        primaryText={'Refresh'}
        title={modalTitle}
        closeModal={closeOverlay}
        closeAllModals={closeAllOverlays}
        showCloseIcon={false}
        onPrimary={() => {
          dispatch(resetComposer());
          dispatch(stopPollActiveStageData());
          dispatch(fetchData({ id: jobId, entity: Entity.JOB, setActive: true }));
          dispatch(startPollActiveStageData({ jobId }));
          closeOverlay();
        }}
      >
        <div>
          Some actions were already performed on this {errorType.toLowerCase()}. Please refresh the
          job to see the changes.
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default RefetchJobComposerData;
