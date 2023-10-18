import { StyledMenu } from '#components';
import { closeOverlayAction, openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { User } from '#store/users/types';
import { StoreTask, TaskAction } from '#types';
import { formatDuration } from '#utils/timeUtils';
import Timer from '#views/Job/components/Task/Timer';
import { jobActions } from '#views/Job/jobStore';
import { useJobStateToFlags } from '#views/Job/utils';
import { MenuItem } from '@material-ui/core';
import { MoreVert, PanTool } from '@material-ui/icons';
import { capitalize } from 'lodash';
import React, { FC, MouseEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Wrapper } from './styles';
import { useTypedSelector } from '#store';

type HeaderProps = {
  task: StoreTask;
};

const Header: FC<HeaderProps> = ({ task }) => {
  const dispatch = useDispatch();
  const { limitCrossed } = useTypedSelector((state) => state.job.timerState);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { isJobStarted, isTaskCompleted, isBlocked } = useJobStateToFlags();

  const {
    taskExecution: { state, reason, correctionEnabled, correctionReason, assignees },
    canSkipTask,
    isUserAssignedToTask,
    id,
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
        if (limitCrossed) return 'Delayed Completion';
        return 'Early Completion';
      case 'SKIPPED':
        return 'Task Skipped';
      case 'COMPLETED_WITH_EXCEPTION':
        return 'Completed with exception';
    }
  };

  const handleEnableErrorCorrection = (reason: string, closeModal: () => void) => {
    dispatch(
      jobActions.performTaskAction({
        id: task.id,
        reason,
        action: TaskAction.ENABLE_ERROR_CORRECTION,
      }),
    );
    closeModal();
  };

  const showMenuActions = () =>
    isJobStarted &&
    isUserAssignedToTask &&
    (!isTaskCompleted || (isTaskCompleted && (!correctionEnabled || !correctionReason)));

  return (
    <Wrapper>
      <div className="task-header">
        <div className="task-config">
          <div className="wrapper">
            <div className="task-name">{task.name}</div>
            <Timer state={state} id={id} />
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
                  {!isTaskCompleted && (
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        if (!isBlocked) {
                          if (canSkipTask) {
                            dispatch(
                              openOverlayAction({
                                type: OverlayNames.REASON_MODAL,
                                props: {
                                  modalTitle: 'Skip Task',
                                  modalDesc: 'Provide the details for skipping the task',
                                  onSubmitHandler: (reason: string, closeModal: () => void) => {
                                    dispatch(
                                      jobActions.performTaskAction({
                                        id: task.id,
                                        reason,
                                        action: TaskAction.SKIP,
                                      }),
                                    );
                                    closeModal();
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
                                  onSubmitHandler: (reason: string, closeModal: () => void) => {
                                    dispatch(
                                      jobActions.performTaskAction({
                                        id: task.id,
                                        reason,
                                        action: TaskAction.COMPLETE_WITH_EXCEPTION,
                                      }),
                                    );
                                    closeModal();
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
                  )}
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
