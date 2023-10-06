import { BaseModal } from '#components';
import React, { FC } from 'react';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import styled from 'styled-components';
import { TASK_EXECUTION_STATES } from '#types';

const Wrapper = styled.div`
  .modal {
    min-width: 400px !important;
    padding: 24px;

    &-body {
      padding: 0 !important;
    }
  }

  .start-task {
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
      color: #999999;
      font-size: 14px;
    }
  }
`;

const StartTaskModal: FC<CommonOverlayProps<{ taskState: string }>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { taskState },
}) => {
  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        showHeader={false}
        showFooter={false}
      >
        <div className="start-task">
          <div className="header">
            Press {taskState === TASK_EXECUTION_STATES.PAUSED ? 'Resume' : 'Start'} Task First
          </div>
          <div className="body">
            You need to {taskState === TASK_EXECUTION_STATES.PAUSED ? 'resume' : 'start'} the Task
            before beginning any Parameter
          </div>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default StartTaskModal;