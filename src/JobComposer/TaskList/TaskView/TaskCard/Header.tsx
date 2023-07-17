import { Task, TaskExecutionState } from '#JobComposer/checklist.types';
import { StyledMenu } from '#components';
import { closeOverlayAction, openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { User } from '#store/users/types';
import { formatDuration } from '#utils/timeUtils';
import { JobStateEnum } from '#views/Jobs/ListView/types';
import { MenuItem } from '@material-ui/core';
import { MoreVert, PanTool } from '@material-ui/icons';
import { capitalize } from 'lodash';
import React, { FC, MouseEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import Timer from './Timer';
import { Wrapper } from './styles';
import { completeTask, enableErrorCorrection, skipTask } from '#JobComposer/TaskList/actions';

type HeaderProps = {
  task: Omit<Task, 'parameters'>;
  showStartButton: boolean;
  isTaskStarted: boolean;
  isTaskDelayed: boolean;
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>;
  timerState: { [index: string]: boolean };
  setTimerState: React.Dispatch<React.SetStateAction<{ [index: string]: boolean }>>;
  canSkipTask: boolean;
};

const Header: FC<HeaderProps> = ({
  task,
  showStartButton,
  isTaskStarted,
  isTaskDelayed,
  setLoadingState,
  timerState,
  setTimerState,
  canSkipTask,
}) => {
  const dispatch = useDispatch();
  const { profile } = useTypedSelector((state) => state.auth);
  const { jobState } = useTypedSelector((state) => state.composer);

  const isJobStarted = jobState === JobStateEnum.IN_PROGRESS || jobState === JobStateEnum.BLOCKED;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { state, reason, correctionEnabled, correctionReason, assignees } = task.taskExecution;

  const isUserAssignedToTask = (assignees || []).some((user) => user.id === profile?.id);

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
      case TaskExecutionState.COMPLETED:
        if (timerState.limitCrossed) return 'Delayed Completion';
        return 'Early Completion';
      case TaskExecutionState.SKIPPED:
        return 'Task Skipped';
      case TaskExecutionState.COMPLETED_WITH_EXCEPTION:
        return 'Completed with exception';
    }
  };

  return (
    <Wrapper
      showStartButton={showStartButton}
      taskExecutionState={task.taskExecution.state}
      isTaskDelayed={isTaskDelayed}
    >
      <div className="job-header">
        <div className="task-config">
          <div className="wrapper">
            <div className="task-name">{task.name}</div>
            <Timer task={task} timerState={timerState} setTimerState={setTimerState} />
          </div>
        </div>
        <div className="task-info">
          <div className="left-section">
            {task.hasStop && (
              <div>
                <PanTool className="icon" style={{ color: '#f2c94c' }} />
              </div>
            )}
            {task.timed && (
              <div className="time-info">
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
            {isJobStarted && isUserAssignedToTask && (
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
                  {(task.taskExecution.state === TaskExecutionState.COMPLETED ||
                    task.taskExecution.state === TaskExecutionState.COMPLETED_WITH_EXCEPTION ||
                    task.taskExecution.state === TaskExecutionState.SKIPPED) && (
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        dispatch(
                          openOverlayAction({
                            type: OverlayNames.REASON_MODAL,
                            props: {
                              modalTitle: 'Error Correction',
                              modalDesc: 'You need to submit a reason to proceed to make changes',
                              onSubmitHandler: (reason: string) => {
                                setLoadingState(true);
                                dispatch(enableErrorCorrection(task.id, reason, setLoadingState));
                              },
                            },
                          }),
                        );
                      }}
                    >
                      Error correction
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      if (jobState !== JobStateEnum.BLOCKED) {
                        if (canSkipTask) {
                          dispatch(
                            openOverlayAction({
                              type: OverlayNames.REASON_MODAL,
                              props: {
                                modalTitle: 'Skip Task',
                                modalDesc: 'Provide the details for skipping the task',
                                onSubmitHandler: (reason: string) => {
                                  setLoadingState(true);
                                  dispatch(skipTask(task.id, setLoadingState, reason));
                                },
                              },
                            }),
                          );
                        } else {
                          dispatch(
                            openOverlayAction({
                              type: OverlayNames.REASON_MODAL,
                              props: {
                                modalTitle: 'Complete with Exception',
                                modalDesc: 'Provide the details for Exception',
                                onSubmitHandler: (reason: string) => {
                                  setLoadingState(true);
                                  dispatch(
                                    completeTask({
                                      taskId: task.id,
                                      setLoadingState,
                                      reason: reason,
                                      withException: true,
                                    }),
                                  );
                                },
                              },
                            }),
                          );
                        }
                      }
                    }}
                  >
                    {canSkipTask ? 'Skip the task' : 'Complete with Exception'}
                  </MenuItem>
                </StyledMenu>
              </>
            )}
          </div>
        </div>
        {reason && (
          <div className="reason-wrapper">
            <div className="badge">{reasonTitle()}</div>
            <div className="reason">{reason}</div>
          </div>
        )}

        {(correctionEnabled || correctionReason) && (
          <div className="reason-wrapper">
            <div className="badge">Error Correction</div>
            <div className="reason">{correctionReason}</div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default Header;
