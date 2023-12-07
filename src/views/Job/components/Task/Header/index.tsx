import { StyledMenu } from '#components';
import { closeOverlayAction, openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { User } from '#store/users/types';
import { StoreTask, TaskAction, TaskExecutionType } from '#types';
import { formatDateTime, formatDuration, getEpochTimeDifference } from '#utils/timeUtils';
import { jobActions } from '#views/Job/jobStore';
import { useJobStateToFlags } from '#views/Job/utils';
import { MenuItem } from '@material-ui/core';
import { MoreVert, PanTool } from '@material-ui/icons';
import { capitalize } from 'lodash';
import React, { FC, MouseEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Wrapper } from './styles';
import { useTypedSelector } from '#store';
import checkPermission from '#services/uiPermissions';
import Timer from '#views/Job/components/Task/Timer';
import repeatTaskIcon from '#assets/svg/repeat-task-icon.svg';
import taskRecurrenceIcon from '#assets/svg/task-recurrence-icon.svg';
import taskRecurrenceIconDisabled from '#assets/svg/task-recurrence-grey.svg';
import Tooltip from '#components/shared/Tooltip';
import scheduleTaskIcon from '#assets/svg/schedule-icon-black.svg';
import ReasonTag from './ReasonTag';

type HeaderProps = {
  task: StoreTask;
};

const Header: FC<HeaderProps> = ({ task }) => {
  const dispatch = useDispatch();
  const {
    timerState: { limitCrossed },
    isInboxView,
  } = useTypedSelector((state) => state.job);
  const { isJobStarted, isTaskCompleted, isBlocked, isTaskStarted } = useJobStateToFlags();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const {
    taskExecution: {
      state,
      reason,
      correctionEnabled,
      correctionReason,
      assignees,
      isUserAssignedToTask,
      type,
      id: taskExecutionId,
      continueRecurrence,
      recurringPrematureStartReason,
      recurringOverdueCompletionReason,
      recurringExpectedStartedAt,
      recurringExpectedDueAt,
      schedulingExpectedStartedAt,
      schedulingExpectedDueAt,
      scheduleOverdueCompletionReason,
      scheduleTaskSummary,
      startedBy,
      startedAt,
      endedBy,
      endedAt,
    },
    canSkipTask,
    enableRecurrence,
    enableScheduling,
  } = task;

  const handleClose = () => setAnchorEl(null);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAssigneeClick = (event: MouseEvent, users: User[]) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.ASSIGNED_USER_DETAIL,
        popOverAnchorEl: event.currentTarget,
        props: {
          users,
        },
      }),
    );
  };

  const reasonTitle = () => {
    switch (state) {
      case 'COMPLETED':
        if (limitCrossed) return 'Delayed completion of Timed Task';
        return 'Early completion of Timed Task';
      case 'SKIPPED':
        return 'Task Skipped';
      case 'COMPLETED_WITH_EXCEPTION':
        return 'Completed With Exception';
    }
  };

  const handleEnableErrorCorrection = (reason: string, closeModal: () => void) => {
    dispatch(
      jobActions.performTaskAction({
        id: taskExecutionId,
        reason,
        action: TaskAction.ENABLE_ERROR_CORRECTION,
      }),
    );
    closeModal();
  };

  const showMenuActions = () => {
    const isErrorCorrectionVisible = isTaskCompleted && (!correctionEnabled || !correctionReason);

    const isCweVisible =
      !isTaskCompleted && !isBlocked && checkPermission(['inbox', 'completeWithException']);

    const isSkipVisible = canSkipTask && !isTaskCompleted && !isBlocked;

    const menuOptionsVisible = isErrorCorrectionVisible || isCweVisible || isSkipVisible;

    return isInboxView && isJobStarted && isUserAssignedToTask && menuOptionsVisible;
  };

  const taskTimeFormat = 'h.mm a';

  return (
    <Wrapper>
      <div className="task-header">
        <div className="task-config">
          <div className="wrapper">
            <div className="task-name">{task.name}</div>
            <Timer state={state} id={taskExecutionId} />
          </div>
        </div>
        <div className="task-info">
          <div className="left-section">
            {task.hasStop && (
              <div>
                <PanTool className="icon" style={{ color: '#f2c94c' }} />
              </div>
            )}
            {type === TaskExecutionType.REPEAT && (
              <div>
                <Tooltip title={'Repeated Task'} arrow>
                  <img src={repeatTaskIcon} />
                </Tooltip>
              </div>
            )}
            {enableRecurrence && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Tooltip
                  title={
                    type === TaskExecutionType.MASTER
                      ? 'This is a recurring task. A new instance of this task can be created once this task is completed.'
                      : 'This an instance of a recurring task.'
                  }
                  arrow
                  textAlignment="left"
                >
                  <img src={continueRecurrence ? taskRecurrenceIcon : taskRecurrenceIconDisabled} />
                </Tooltip>
                {type === TaskExecutionType.RECURRING ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span>
                      Start Time -{' '}
                      {formatDateTime({
                        value: recurringExpectedStartedAt,
                        format: taskTimeFormat,
                      })}
                    </span>
                    <span>
                      Due At -{' '}
                      {formatDateTime({ value: recurringExpectedDueAt, format: taskTimeFormat })}
                    </span>
                  </div>
                ) : null}
              </div>
            )}
            {task.timed && (
              <div className="time-info" style={{ padding: '6px 15px' }}>
                <div>
                  {task.timerOperator === 'NOT_LESS_THAN' ? (
                    <>
                      <span>
                        Perform task in NLT {task.minPeriod && formatDuration(task.minPeriod)}
                      </span>
                      <span>
                        Max Time limit - {task.maxPeriod && formatDuration(task?.maxPeriod)}
                      </span>
                    </>
                  ) : (
                    <span>Complete under {task.maxPeriod && formatDuration(task?.maxPeriod)}</span>
                  )}
                </div>
              </div>
            )}
            {task.automations.length > 0 && (
              <div
                onClick={() => {
                  dispatch(
                    openOverlayAction({
                      type: OverlayNames.AUTOMATION_TASK_MODAL,
                      props: {
                        task: task,
                      },
                    }),
                  );
                }}
                style={{ display: 'flex', cursor: 'pointer', gap: '10px', color: '#1D84FF' }}
              >
                <Tooltip title={'Automation Task'} arrow>
                  <img src={repeatTaskIcon} />
                </Tooltip>
                <span style={{ margin: '5px' }}>Automations ({task.automations.length})</span>
              </div>
            )}
            {type === TaskExecutionType.MASTER && enableScheduling && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Tooltip
                  title={scheduleTaskSummary ? scheduleTaskSummary : 'Task is scheduled'}
                  arrow
                >
                  <img src={scheduleTaskIcon} />
                </Tooltip>
                {schedulingExpectedStartedAt && schedulingExpectedDueAt ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span>
                      Start Time -{' '}
                      {formatDateTime({
                        value: schedulingExpectedStartedAt,
                        format: taskTimeFormat,
                      })}
                    </span>
                    <span>
                      End Time -{' '}
                      {formatDateTime({ value: schedulingExpectedDueAt, format: taskTimeFormat })}
                    </span>
                  </div>
                ) : null}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Assignees:</span>
              {assignees && assignees.length > 0 && (
                <div className="task-assignees">
                  {assignees.slice(0, 4).map((user) => (
                    <div
                      key={`assignee_${user.id}`}
                      className="user-thumb"
                      aria-haspopup="true"
                      onMouseEnter={(e) => handleAssigneeClick(e, [user])}
                      onMouseLeave={() =>
                        dispatch(closeOverlayAction(OverlayNames.ASSIGNED_USER_DETAIL))
                      }
                    >
                      {capitalize(user.firstName).substring(0, 1)}
                      {capitalize(user.lastName).substring(0, 1)}
                    </div>
                  ))}
                  {assignees.length > 4 && (
                    <div
                      key={`assignee_length`}
                      className="user-thumb"
                      aria-haspopup="true"
                      onMouseEnter={(e) => handleAssigneeClick(e, assignees.slice(4))}
                    >
                      +{assignees.length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="right-section" style={{ paddingRight: 16 }}>
            {showMenuActions() && (
              <>
                <div onClick={handleClick} className="more">
                  <MoreVert />
                </div>

                <StyledMenu
                  id="task-error-correction"
                  anchorEl={anchorEl}
                  keepMounted
                  disableEnforceFocus
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  style={{ marginTop: 30 }}
                >
                  {isTaskCompleted && (!correctionEnabled || !correctionReason) && (
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        dispatch(
                          openOverlayAction({
                            type: OverlayNames.REASON_MODAL,
                            props: {
                              modalTitle: 'Error Correction',
                              modalDesc: 'You need to submit a reason to proceed to make changes',
                              onSubmitHandler: handleEnableErrorCorrection,
                            },
                          }),
                        );
                      }}
                    >
                      Error correction
                    </MenuItem>
                  )}
                  {!isTaskCompleted && !isBlocked && (
                    <>
                      {canSkipTask && (
                        <MenuItem
                          onClick={() => {
                            handleClose();
                            dispatch(
                              openOverlayAction({
                                type: OverlayNames.REASON_MODAL,
                                props: {
                                  modalTitle: 'Skip Task',
                                  modalDesc: 'Provide the details for skipping the task',
                                  onSubmitHandler: (reason: string, closeModal: () => void) => {
                                    dispatch(
                                      jobActions.performTaskAction({
                                        id: taskExecutionId,
                                        reason,
                                        action: TaskAction.SKIP,
                                      }),
                                    );
                                    closeModal();
                                  },
                                },
                              }),
                            );
                          }}
                        >
                          Skip the task
                        </MenuItem>
                      )}
                      {checkPermission(['inbox', 'completeWithException']) && (
                        <MenuItem
                          onClick={() => {
                            handleClose();
                            dispatch(
                              openOverlayAction({
                                type: OverlayNames.REASON_MODAL,
                                props: {
                                  modalTitle: 'Complete with Exception',
                                  modalDesc: 'Provide the details for Exception',
                                  onSubmitHandler: (reason: string, closeModal: () => void) => {
                                    dispatch(
                                      jobActions.performTaskAction({
                                        id: taskExecutionId,
                                        reason,
                                        action: TaskAction.COMPLETE_WITH_EXCEPTION,
                                      }),
                                    );
                                    closeModal();
                                  },
                                },
                              }),
                            );
                          }}
                        >
                          Complete with Exception
                        </MenuItem>
                      )}
                    </>
                  )}
                  {isTaskCompleted && !enableRecurrence && (
                    <MenuItem
                      onClick={() => {
                        dispatch(
                          openOverlayAction({
                            type: OverlayNames.CONFIRMATION_MODAL,
                            props: {
                              onPrimary: () => {
                                dispatch(jobActions.repeatTask({ id: task.id }));
                              },
                              primaryText: 'Yes',
                              secondaryText: 'No',
                              title: 'Repeat Task',
                              body: <>Are you sure you want to repeat the Task?</>,
                            },
                          }),
                        );
                      }}
                    >
                      Repeat the Task
                    </MenuItem>
                  )}
                  {type === TaskExecutionType.REPEAT && !isTaskStarted && (
                    <MenuItem
                      onClick={() => {
                        dispatch(jobActions.removeRepeatTask({ taskExecutionId }));
                      }}
                    >
                      Remove Repeated Task
                    </MenuItem>
                  )}
                  {!isTaskCompleted && enableRecurrence && continueRecurrence && (
                    <MenuItem
                      onClick={() => {
                        dispatch(
                          openOverlayAction({
                            type: OverlayNames.END_TASK_RECURRENCE_MODAL,
                            props: {
                              onPrimary: () => {
                                dispatch(jobActions.endTaskRecurrence({ taskExecutionId }));
                              },
                            },
                          }),
                        );
                      }}
                    >
                      End Recurrence
                    </MenuItem>
                  )}
                </StyledMenu>
              </>
            )}
          </div>
        </div>
        {!isTaskCompleted &&
          type === TaskExecutionType.RECURRING &&
          getEpochTimeDifference(recurringExpectedDueAt) === 'LATE' && (
            <div className="task-banner task-overdue-banner">Task is overdue</div>
          )}
        {!isTaskCompleted &&
          enableScheduling &&
          schedulingExpectedDueAt &&
          getEpochTimeDifference(schedulingExpectedDueAt) === 'LATE' && (
            <div className="task-banner task-overdue-banner">Task is overdue</div>
          )}
        {!isTaskStarted &&
          enableScheduling &&
          schedulingExpectedStartedAt &&
          (getEpochTimeDifference(schedulingExpectedStartedAt) === 'ON TIME' ||
            getEpochTimeDifference(schedulingExpectedStartedAt) === 'LATE') && (
            <div className="task-banner scheduled-task-banner">Task is ready to start</div>
          )}
        <div className="reason-tags">
          {reason && (
            <ReasonTag
              startedBy={startedBy}
              startedAt={startedAt}
              reason={reason}
              modalTitle={reasonTitle()}
              badgeText={reasonTitle()}
            />
          )}

          {(correctionEnabled || correctionReason) && (
            <ReasonTag
              startedBy={startedBy}
              startedAt={startedAt}
              reason={correctionReason}
              modalTitle="Error Correction"
              badgeText="Error Correction"
            />
          )}

          {recurringPrematureStartReason && (
            <ReasonTag
              startedBy={startedBy}
              startedAt={startedAt}
              reason={recurringPrematureStartReason}
              reasonType="start"
              modalTitle="Early start for recurring task"
              badgeText="Early start for recurring task"
            />
          )}

          {(recurringOverdueCompletionReason || scheduleOverdueCompletionReason) && (
            <ReasonTag
              startedBy={endedBy}
              startedAt={endedAt}
              reason={recurringOverdueCompletionReason || scheduleOverdueCompletionReason}
              reasonType="end"
              modalTitle={
                recurringOverdueCompletionReason
                  ? 'Delayed completion for recurring task'
                  : 'Delayed completion for scheduled task'
              }
              badgeText={
                recurringOverdueCompletionReason
                  ? 'Delayed completion for recurring task'
                  : 'Delayed completion for scheduled task'
              }
            />
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default Header;
