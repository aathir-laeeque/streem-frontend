import { Button } from '#components';
import { closeOverlayAction, openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { StartedTaskStates, Task, TaskExecutionState } from '#JobComposer/checklist.types';
import { getUserName } from '#services/users/helpers';
import { useTypedSelector } from '#store';
import { User } from '#store/users/types';
import { formatDateTime } from '#utils/timeUtils';
import { JobStateEnum } from '#views/Jobs/ListView/types';
import { Menu, MenuItem } from '@material-ui/core';
import { Assignment, Error, MoreHoriz, PanTool } from '@material-ui/icons';
import { capitalize } from 'lodash';
import React, { FC, MouseEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { startTask } from '../../actions';
import { Wrapper } from './styles';
import TaskAssignmentContent from './TaskAssignmentContent';
import Timer from './Timer';

type HeaderProps = {
  task: Omit<Task, 'parameters'>;
  showStartButton: boolean;
  isTaskStarted: boolean;
  isTaskDelayed: boolean;
  enableStopForTask: boolean;
  showAssignmentButton: boolean;
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>;
  timerState: { [index: string]: boolean };
  setTimerState: React.Dispatch<React.SetStateAction<{ [index: string]: boolean }>>;
};

const JobHeader: FC<
  Pick<
    HeaderProps,
    | 'task'
    | 'enableStopForTask'
    | 'showAssignmentButton'
    | 'setLoadingState'
    | 'timerState'
    | 'setTimerState'
  >
> = ({
  task,
  enableStopForTask,
  showAssignmentButton,
  setLoadingState,
  timerState,
  setTimerState,
}) => {
  const dispatch = useDispatch();
  const { profile, selectedFacility } = useTypedSelector((state) => state.auth);
  const { dateAndTimeStampFormat } = useTypedSelector(
    (state) => state.facilityWiseConstants[selectedFacility!.id],
  );

  const {
    stages: { activeStageId, stagesById },
    jobState,
    data: { id: jobId } = {},
  } = useTypedSelector((state) => state.composer);

  const isJobStarted = jobState === JobStateEnum.IN_PROGRESS || jobState === JobStateEnum.BLOCKED;

  const stageOrderTree = stagesById[activeStageId as string].orderTree;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

  const { state, startedAt, startedBy, reason, correctionEnabled, correctionReason, assignees } =
    task.taskExecution;

  const isUserAssignedToTask = assignees.some((user) => user.id === profile?.id);

  return (
    <div className="job-header">
      {assignees && assignees.length > 0 && (
        <div className="task-assignees">
          <span>This Task’s Assignees</span>
          <div>
            {assignees.slice(0, 4).map((user) => (
              <div
                key={`assignee_${user.id}`}
                className="user-thumb"
                aria-haspopup="true"
                onMouseEnter={(e) => handleAssigneeClick(e, [user])}
                onMouseLeave={() => dispatch(closeOverlayAction(OverlayNames.ASSIGNED_USER_DETAIL))}
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
                onMouseLeave={() => dispatch(closeOverlayAction(OverlayNames.ASSIGNED_USER_DETAIL))}
              >
                +{assignees.length - 4}
              </div>
            )}
          </div>
        </div>
      )}
      {state in StartedTaskStates && startedAt ? (
        <div className="start-audit">
          Task started by {getUserName({ user: startedBy! })}, ID: {startedBy!.employeeId} on{' '}
          {formatDateTime(startedAt, dateAndTimeStampFormat)}
        </div>
      ) : null}

      <div className="stop-banner">
        <PanTool className="icon" />

        <span>Complete this task before proceeding to the next task.</span>
      </div>

      <div className="task-config">
        <div className="wrapper">
          <div className="task-name">
            {stageOrderTree}.{task.orderTree}. {task.name}
          </div>
          {showAssignmentButton && (
            <TaskAssignmentContent
              taskId={task.id}
              jobId={jobId as string}
              taskExecutionId={task.taskExecution.id}
            />
          )}

          {isJobStarted && isUserAssignedToTask && (
            <>
              <Button
                className="start-task"
                variant="secondary"
                onClick={() => {
                  if (enableStopForTask) {
                    dispatch(
                      openOverlayAction({
                        type: OverlayNames.ADD_STOP,
                        props: {},
                      }),
                    );
                  } else {
                    setLoadingState(true);
                    dispatch(startTask(task.id, setLoadingState));
                  }
                }}
              >
                Start task
              </Button>
              <div onClick={handleClick}>
                <MoreHoriz className="icon complete-options" />
              </div>

              <Menu
                id="task-error-correction"
                anchorEl={anchorEl}
                keepMounted
                disableEnforceFocus
                open={Boolean(anchorEl)}
                onClose={handleClose}
                style={{ marginTop: 30 }}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    dispatch(
                      openOverlayAction({
                        type: OverlayNames.TASK_ERROR_CORRECTION,
                        props: { taskId: task.id, setLoadingState },
                      }),
                    );
                  }}
                >
                  <Error className="icon" />
                  Error correction
                </MenuItem>
              </Menu>
            </>
          )}
        </div>

        {task.timed ? (
          <Timer task={task} timerState={timerState} setTimerState={setTimerState} />
        ) : null}
      </div>

      {state === TaskExecutionState.SKIPPED ||
      state === TaskExecutionState.COMPLETED_WITH_EXCEPTION ? (
        <div className="skip-reason">
          <div className="badge">
            <Assignment className="icon" />
            {state === TaskExecutionState.COMPLETED_WITH_EXCEPTION
              ? 'Completed with exception'
              : 'Task Skipped'}
          </div>
          <textarea
            className="new-form-field-textarea"
            value={reason ?? undefined}
            disabled
            rows={4}
          />
        </div>
      ) : null}

      {(correctionEnabled || correctionReason) && (
        <div className="correction-reason">
          <div className="badge">
            <Assignment className="icon" />
            Error Correction
          </div>
          <textarea
            className="new-form-field-textarea"
            value={correctionReason ?? undefined}
            disabled
            rows={4}
          />
        </div>
      )}
    </div>
  );
};

const Header: FC<HeaderProps> = ({
  task,
  showStartButton,
  isTaskStarted,
  isTaskDelayed,
  enableStopForTask,
  showAssignmentButton,
  setLoadingState,
  timerState,
  setTimerState,
}) => {
  return (
    <Wrapper
      hasStop={task.hasStop}
      showStartButton={showStartButton}
      taskExecutionState={task.taskExecution.state}
      isTaskStarted={isTaskStarted}
      isTaskDelayed={isTaskDelayed}
    >
      <JobHeader
        task={task}
        enableStopForTask={enableStopForTask}
        showAssignmentButton={showAssignmentButton}
        setLoadingState={setLoadingState}
        timerState={timerState}
        setTimerState={setTimerState}
      />
    </Wrapper>
  );
};

export default Header;
