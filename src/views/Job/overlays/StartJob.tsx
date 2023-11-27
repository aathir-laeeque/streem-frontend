import { BaseModal } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { jobActions } from '../jobStore';

const Wrapper = styled.div`
  .modal {
    width: 406px !important;

    p {
      margin: 0px;
      font-size: 14px;
      color: #525252;
      line-height: 16px;
    }

    .modal-footer {
      justify-content: flex-end;
    }
  }
`;

const StartJobModal: FC<
  CommonOverlayProps<{
    jobId: string;
  }>
> = ({ closeAllOverlays, closeOverlay, props }) => {
  const dispatch = useDispatch();
  const { jobId } = props || {};
  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        title="Start Job"
        primaryText="Start Job"
        secondaryText="Cancel"
        onPrimary={() =>
          dispatch(
            jobActions.startJob({
              id: jobId,
            }),
          )
        }
      >
        <div>
          <p>It looks like you're ready to start working on this Job.</p>
          <br />
          <p>
            Before you begin, you need to press the ‘Start Job’
            <br /> button.
          </p>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default StartJobModal;
