import { BaseModal } from '#components';
import { Task } from '#Composer/checklist.types';
import { useTypedSelector } from '#store';
import { PanTool } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setActiveStage } from '../StageList/actions';
import { setActiveTask } from '../TaskList/actions';

const Wrapper = styled.div`
  .task-stop {
    display: flex;
    flex-direction: column;

    .header {
      align-items: center;
      color: #000000;
      display: flex;
      font-size: 20px;
      justify-content: center;

      .icon {
        color: #f7b500;
        font-size: 30px;
        margin-right: 12px;
      }
    }

    .body {
      color: #000000;
      font-size: 14px;
      letter-spacing: 0.16px;
      margin-top: 12px;
    }

    .footer {
      color: #1d84ff;
      font-size: 14px;
      line-height: 1.29;
      letter-spacing: 0.16px;
      margin-top: 16px;
      cursor: pointer;
    }
  }
`;

type TaskStopModalProps = {
  closeAllModals: () => void;
  closeModal: () => void;
  taskId: Task['id'];
};

const TaskStopModal: FC<TaskStopModalProps> = ({
  closeAllModals,
  closeModal,
}) => {
  const dispatch = useDispatch();

  const {
    stages: { stagesById },
    tasks: { taskIdWithStop, tasksById, stageIdWithTaskStop },
  } = useTypedSelector((state) => state.composer);

  const { orderTree: stageNumber } = stagesById[stageIdWithTaskStop];

  const { orderTree: taskNumber } = tasksById[taskIdWithStop];

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllModals}
        closeModal={closeModal}
        onPrimary={() => {
          closeModal();
        }}
        onSecondary={() => closeModal()}
        showHeader={false}
        showFooter={false}
      >
        <div className="task-stop">
          <div className="header">
            <PanTool className="icon" />
            Stop
          </div>
          <div className="body">
            You need to complete task no {taskNumber} in stage no {stageNumber}{' '}
            before coming to this task
          </div>
          <div
            className="footer"
            onClick={() => {
              dispatch(setActiveStage(stageIdWithTaskStop, true));
              dispatch(setActiveTask(taskIdWithStop, true));
              closeModal();
            }}
          >
            Go to the task
          </div>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default TaskStopModal;