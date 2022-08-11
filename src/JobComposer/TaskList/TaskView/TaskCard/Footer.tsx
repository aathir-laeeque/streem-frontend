import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { AutomationActionActionType, Task, TaskExecutionState } from '#JobComposer/checklist.types';
import { useTypedSelector } from '#store/helpers';
import { formatDateTime } from '#utils/timeUtils';
import { JobStateEnum } from '#views/Jobs/NewListView/types';
import { ArrowRightAlt, CheckCircle, Error } from '@material-ui/icons';
import moment from 'moment';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';

import { cancelErrorCorretcion, completeErrorCorretcion, completeTask } from '../../actions';

const Wrapper = styled.div.attrs({
  className: 'task-buttons',
})`
  display: flex;
  flex-direction: column;
  padding: 0 16px 16px;

  button {
    align-items: center;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    outline: none;
  }

  .complete-task {
    border: 1px solid #1d84ff;
    border-radius: 4px;
    color: #1d84ff;
    padding: 8px 16px;

    > .icon {
      color: #1d84ff;
      margin-left: 12px;
    }
  }

  .skip-task {
    color: #1d84ff;
    margin-top: 16px;
  }

  .error-badge {
    align-items: center;
    color: #ff6b6b;
    display: flex;
    font-size: 12px;
    justify-content: center;
    margin-top: 16px;
  }
`;

const DelayWrapper = styled.div`
  display: flex;
  padding: 32px;
  flex-direction: column;

  .buttons-container {
    margin-top: 16px;

    button {
      border: 1px solid transparent;
      outline: none;
      padding: 10px 24px;
      background: transparent;

      :first-child {
        border-color: #1d84ff;
        color: #1d84ff;
      }

      :last-child {
        margin-left: 24px;
        border-color: #ff6b6b;
        color: #ff6b6b;
      }
    }
  }
`;

const CompletedWrapper = styled.div.attrs({
  className: '',
})<{
  completed?: boolean;
  skipped?: boolean;
  isTaskDelayed?: string;
  completedWithException?: boolean;
}>`
  align-items: center;
  ${({ completed, skipped, isTaskDelayed, completedWithException }) => {
    if (completed) {
      if (isTaskDelayed) {
        return css`
          background-color: #f7b500;
        `;
      }
      return css`
        background-color: #5aa700;
      `;
    } else if (skipped || completedWithException) {
      return css`
        background-color: #f7b500;
      `;
    }
  }}
  color: #ffffff;
  display: flex;
  justify-content: center;
  padding: 16px;

  > .icon {
    color: #ffffff;
    margin-right: 8px;
    opacity: 0.5;
    font-size: 16px;
  }

  > span {
    font-size: 14px;
  }

  .task-off-limit-reason {
    background-color: rgba(247, 181, 0, 0.08);
    padding: 16px 32px;

    textarea {
      font-size: 12px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      color: #000000;
    }
  }
`;

const DelayedWrapper = styled.div`
  display: flex;
  flex-direction: column;

  background-color: rgba(247, 181, 0, 0.08);

  .task-off-limit-reason {
    padding: 16px 32px;

    textarea {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 16px;
      font-size: 14px;
      color: #000000;
      resize: none;
      width: 100%;
    }
  }
`;

type FooterProps = {
  canSkipTask: boolean;
  activitiesHasError: boolean;
  task: Omit<Task, 'activities'>;
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>;
  timerState: { [index: string]: boolean };
};

const generateName = ({ firstName, lastName }: { firstName: string; lastName: string }) =>
  `${firstName} ${lastName}`;

const Footer: FC<FooterProps> = ({
  canSkipTask,
  task,
  activitiesHasError,
  setLoadingState,
  timerState,
}) => {
  const dispatch = useDispatch();
  const {
    auth: { profile, selectedFacility },
    composer: { jobState },
  } = useTypedSelector((state) => state);
  const { dateAndTimeStampFormat } = useTypedSelector(
    (state) => state.facilityWiseConstants[selectedFacility!.id],
  );

  const isJobBlocked = jobState === JobStateEnum.BLOCKED;

  const [shouldAskForReason, setAskForReason] = useState(false);
  const [delayReason, setDelayReason] = useState('');

  const {
    audit: { modifiedBy, modifiedAt },
    state: taskExecutionState,
    reason,
    assignees,
  } = task.taskExecution;

  const isTaskDelayed = taskExecutionState === TaskExecutionState.COMPLETED && reason;

  const isUserAssignedToTask = assignees.some((user) => user.id === profile?.id);

  const onCompleteJob = (reason?: string) => {
    setLoadingState(true);
    if (task.automations?.length) {
      const createObjectAutomation = (task.automations || []).find(
        (automation) => automation.actionType === AutomationActionActionType.CREATE_OBJECT,
      );
      if (createObjectAutomation) {
        const otherAutomations = task.automations.filter(
          (automation) => automation.actionType !== AutomationActionActionType.CREATE_OBJECT,
        );
        dispatch(
          openOverlayAction({
            type: OverlayNames.AUTOMATION_ACTION,
            props: {
              objectTypeId: createObjectAutomation.actionDetails.objectTypeId,
              onDone: () =>
                dispatch(
                  completeTask({
                    taskId: task.id,
                    setLoadingState,
                    reason,
                    automations: otherAutomations.length ? otherAutomations : undefined,
                  }),
                ),
              setLoadingState,
            },
          }),
        );
      } else {
        dispatch(
          completeTask({
            taskId: task.id,
            setLoadingState,
            reason,
            automations: task.automations,
          }),
        );
      }
    } else {
      dispatch(
        completeTask({
          taskId: task.id,
          setLoadingState,
          reason,
        }),
      );
    }
  };

  if (!!task.taskExecution.correctionEnabled) {
    return (
      <div className="buttons-container" style={{ display: 'flex', padding: '0 16px 16px' }}>
        <button
          style={{
            border: '1px solid #5ca6ff',
            color: '#5ca6ff',
            outline: 'none',
            padding: '10px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            background: 'transparent',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={() => {
            setLoadingState(true);
            dispatch(completeErrorCorretcion(task.id, setLoadingState));
          }}
        >
          Confirm
        </button>
        <button
          style={{
            border: '1px solid #ff6b6b',
            color: '#ff6b6b',
            outline: 'none',
            padding: '10px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            marginLeft: '24px',
            borderRadius: '4px',
            background: 'transparent',
            cursor: 'pointer',
          }}
          onClick={() => {
            setLoadingState(true);
            dispatch(cancelErrorCorretcion(task.id, setLoadingState));
          }}
        >
          Cancel
        </button>
      </div>
    );
  } else if (taskExecutionState === TaskExecutionState.COMPLETED) {
    if (isTaskDelayed) {
      let text;
      if (timerState.limitCrossed) {
        text = 'after the set time';
      } else if (task.timerOperator === 'NOT_LESS_THAN' && timerState.earlyCompletion) {
        text = 'before the set time';
      }

      return (
        <DelayedWrapper>
          <CompletedWrapper completed isTaskDelayed={isTaskDelayed}>
            <Error className="icon" />
            <span>
              Task completed {text} by {generateName(modifiedBy)}, ID: {modifiedBy.employeeId} on{' '}
              {formatDateTime(modifiedAt, dateAndTimeStampFormat)}
            </span>
          </CompletedWrapper>
          {reason ? (
            <div className="task-off-limit-reason">
              <textarea value={reason} rows={4} disabled />
            </div>
          ) : null}
        </DelayedWrapper>
      );
    } else {
      return (
        <CompletedWrapper completed>
          <CheckCircle className="icon" />
          <span>
            Task completed by {generateName(modifiedBy)}, ID: {modifiedBy.employeeId} on{' '}
            {formatDateTime(modifiedAt, dateAndTimeStampFormat)}
          </span>
        </CompletedWrapper>
      );
    }
  } else if (taskExecutionState === TaskExecutionState.COMPLETED_WITH_EXCEPTION) {
    return (
      <CompletedWrapper completedWithException>
        <CheckCircle className="icon" />
        <span>
          Task completed with exception by {generateName(modifiedBy)}, ID: {modifiedBy.employeeId}{' '}
          on {formatDateTime(modifiedAt, dateAndTimeStampFormat)}
        </span>
      </CompletedWrapper>
    );
  } else if (taskExecutionState === TaskExecutionState.SKIPPED) {
    return (
      <CompletedWrapper skipped>
        <CheckCircle className="icon" />
        <span>
          Task skipped by {generateName(modifiedBy)}, ID: {modifiedBy.employeeId} on{' '}
          {formatDateTime(modifiedAt, dateAndTimeStampFormat)}
        </span>
      </CompletedWrapper>
    );
  } else if (task.taskExecution.state === TaskExecutionState.IN_PROGRESS) {
    if (shouldAskForReason) {
      let text;
      if (timerState.limitCrossed) {
        text = 'State your reason for delay';
      } else if (task.timerOperator === 'NOT_LESS_THAN' && timerState.earlyCompletion) {
        text = 'State your reason for early completion';
      }
      return (
        <DelayWrapper>
          <div className="new-form-field">
            <label className="new-form-field-label">{text}</label>
            <textarea
              className="new-form-field-textarea"
              name="reason"
              value={delayReason}
              rows={4}
              onChange={(e) => setDelayReason(e.target.value)}
            />
          </div>
          <div className="buttons-container">
            <button
              onClick={() => {
                onCompleteJob(delayReason);
              }}
            >
              Submit
            </button>
            <button
              onClick={() => {
                setDelayReason('');
                setAskForReason(false);
              }}
            >
              Cancel
            </button>
          </div>
        </DelayWrapper>
      );
    } else {
      return (
        <Wrapper>
          {isUserAssignedToTask && (
            <>
              <button
                className="complete-task"
                onClick={() => {
                  if (!isJobBlocked) {
                    if (task.timed && (timerState.earlyCompletion || timerState.limitCrossed)) {
                      setAskForReason(true);
                    } else {
                      onCompleteJob();
                    }
                  }
                }}
              >
                Complete Task <ArrowRightAlt className="icon" />
              </button>

              <button
                className="skip-task"
                onClick={() => {
                  if (!isJobBlocked) {
                    if (canSkipTask) {
                      dispatch(
                        openOverlayAction({
                          type: OverlayNames.SKIP_TASK_MODAL,
                          props: { taskId: task.id, setLoadingState },
                        }),
                      );
                    } else {
                      dispatch(
                        openOverlayAction({
                          type: OverlayNames.COMPLETE_TASK_WITH_EXCEPTION,
                          props: { taskId: task.id, setLoadingState },
                        }),
                      );
                    }
                  }
                }}
              >
                {canSkipTask ? 'Skip the task' : 'Complete with Exception'}
              </button>
            </>
          )}

          {activitiesHasError ? (
            <div className="error-badge">
              Mandatory Activity is incomplete, you cannot complete this Task,
            </div>
          ) : null}
        </Wrapper>
      );
    }
  }

  return null;
};

export default Footer;
