import { BaseModal } from '#components';
import React, { FC } from 'react';
import { CommonOverlayProps, OverlayNames } from '#components/OverlayContainer/types';
import styled from 'styled-components';
import { StoreTask, TaskAction, TaskExecutionType } from '#types';
import { useDispatch } from 'react-redux';
import { jobActions } from '../jobStore';
import {
  AutomationActionActionType,
  AutomationActionTriggerType,
} from '#PrototypeComposer/checklist.types';
import { closeOverlayAction, openOverlayAction } from '#components/OverlayContainer/actions';
import { getEpochTimeDifference } from '#utils/timeUtils';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';

const Wrapper = styled.div`
  .modal {
    width: 406px !important;

    div {
      font-size: 14px;
      color: #525252;
      line-height: 16px;
    }

    .modal-footer {
      justify-content: flex-end;
    }
  }
`;

const modalTitle = (action: string) => {
  return `Press ${action} Task First`;
};

const StartTaskModal: FC<CommonOverlayProps<{ task: StoreTask }>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { task },
}) => {
  const dispatch = useDispatch();
  const action = task?.taskExecution?.state === 'PAUSED' ? 'Resume' : 'Start';

  const {
    id: taskExecutionId,
    recurringExpectedStartedAt,
    schedulingExpectedStartedAt,
    type,
  } = task?.taskExecution;

  const onStartTask = (recurringPrematureStartReason: string = '') => {
    const handleStartTask = (createObjectAutomation: any[] = []) => {
      dispatch(
        jobActions.performTaskAction({
          id: taskExecutionId,
          action: TaskAction.START,
          ...(createObjectAutomation.length > 0 && {
            createObjectAutomations: createObjectAutomation,
          }),
          ...(recurringPrematureStartReason && { recurringPrematureStartReason }),
        }),
      );
    };
    if (task.automations?.length) {
      const createObjectAutomation = (task.automations || []).find(
        (automation) =>
          automation.actionType === AutomationActionActionType.CREATE_OBJECT &&
          automation.triggerType === AutomationActionTriggerType.TASK_STARTED,
      );
      if (createObjectAutomation) {
        dispatch(
          openOverlayAction({
            type: OverlayNames.AUTOMATION_ACTION,
            props: {
              objectTypeId: createObjectAutomation.actionDetails.objectTypeId,
              onDone: (createObjectData: any) => {
                const createObjectAutomations = [
                  {
                    automationId: createObjectAutomation.id,
                    entityObjectValueRequest: createObjectData,
                  },
                ];
                handleStartTask(createObjectAutomations);
                dispatch(closeOverlayAction(OverlayNames.AUTOMATION_ACTION));
              },
              setLoadingState: () => {},
            },
          }),
        );
      } else {
        handleStartTask();
      }
    } else {
      handleStartTask();
    }
  };

  const onPrimary = () => {
    if (task.enableScheduling && getEpochTimeDifference(schedulingExpectedStartedAt) === 'EARLY') {
      dispatch(
        showNotification({
          type: NotificationType.ERROR,
          msg: 'Task cannot be started before its scheduled start time.',
        }),
      );
    } else if (
      task?.enableRecurrence &&
      type === TaskExecutionType.RECURRING &&
      getEpochTimeDifference(recurringExpectedStartedAt) === 'EARLY'
    ) {
      dispatch(
        openOverlayAction({
          type: OverlayNames.REASON_MODAL,
          props: {
            modalTitle: 'Start the Task',
            modalDesc:
              'Are you sure you want to start the task before it’s start time ? Please provide a reason for it.',
            onSubmitHandler: (reason: string) => {
              onStartTask(reason);
              dispatch(closeOverlayAction(OverlayNames.REASON_MODAL));
            },
          },
        }),
      );
    } else {
      onStartTask();
    }
  };

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        title={modalTitle(action)}
        primaryText={`${action} task`}
        secondaryText="Cancel"
        onPrimary={() => onPrimary()}
      >
        <div>
          You need to {action.toLowerCase()} the Task before executing any
          <br /> parameter.
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default StartTaskModal;
