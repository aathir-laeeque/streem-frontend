import { BaseModal } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { PanToolOutlined } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { jobActions } from '../jobStore';

const Wrapper = styled.div`
  .modal {
    min-width: 400px !important;
  }

  .task-stop {
    display: flex;
    flex-direction: column;
    width: 400px;
    padding: 16px 40px;

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
      line-height: normal;
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

const TaskStopModal: FC<CommonOverlayProps<{ id: string }>> = ({
  closeAllOverlays,
  closeOverlay,
  props,
}) => {
  const dispatch = useDispatch();

  const { id } = props;

  const { tasks, stages } = useTypedSelector((state) => state.job);
  const taskWithStop = tasks.get(id);
  const stageWithTaskStop = stages.get(taskWithStop.stageId);

  const { orderTree: stageNumber } = stageWithTaskStop;

  const { orderTree: taskNumber } = taskWithStop;

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        showHeader={false}
        showFooter={false}
      >
        <div className="task-stop">
          <div className="header">
            <PanToolOutlined className="icon" />
            Stop
          </div>
          <div className="body">
            {`You need to complete Task No.${taskNumber} in Stage No. ${stageNumber} before coming to this task`}
          </div>
          <div
            className="footer"
            onClick={() => {
              dispatch(
                jobActions.navigateByTaskId({
                  id: taskWithStop!.id,
                }),
              );

              closeOverlay();
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
