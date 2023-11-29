import { useTypedSelector } from '#store';
import {
  COMPLETED_TASK_STATES,
  IN_PROGRESS_TASK_STATES,
  TaskExecutionStates,
  TaskExecutionType,
} from '#types';
import { jobActions } from '#views/Job/jobStore';
import { FiberManualRecord } from '@material-ui/icons';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import taskRecurrenceIcon from '#assets/svg/task-recurrence-icon.svg';
import taskRecurrenceIconDisabled from '#assets/svg/task-recurrence-grey.svg';
import repeatTaskIcon from '#assets/svg/repeat-task-icon.svg';
import arrowIcon from '#assets/svg/arrow-background.svg';
import Tooltip from '#components/shared/Tooltip';
import { checkJobExecutionDelay, formatDateTime, getEpochTimeDifference } from '#utils/timeUtils';
import scheduleTaskIcon from '#assets/svg/schedule-icon-black.svg';
import scheduleTaskIconActive from '#assets/svg/schedule-icon-blue.svg';
import { request } from '#utils/request';
import { apiTaskSchedule } from '#utils/apiUrls';
import { getSummary } from '#utils/summaryUtils';
import { ScheduledTaskCondition, ScheduledTaskType } from '#types';
import { getUnixTime } from 'date-fns';

const taskStateColor = (taskStatus: TaskExecutionStates) => {
  switch (taskStatus) {
    case 'NOT_STARTED':
      return '#F4F4F4';
    case 'IN_PROGRESS':
      return '#24A148';
    case 'BLOCKED':
      return '#FA4D56';
    case 'COMPLETED':
      return '#E0E0E0';
    case 'COMPLETED_WITH_EXCEPTION':
      return '#F1C21B';
    default:
      break;
  }
};

const TaskDetailCardWrapper = styled.div.attrs({
  className: 'task-detail-card-wrapper',
})<{ backgroundColor?: string; error: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 45px;
  background-color: #ffffff;
  width: 100%;
  cursor: pointer;
  border-bottom: 1px solid #e0e0e0;

  background-color: ${({ backgroundColor }) => `${backgroundColor}`};

  :hover {
    background-color: #e7f1fd;
  }

  .title {
    white-space: nowrap;
    color: ${({ error }) => `${error ? '#DA1E28' : 'unset'}`};
  }

  .task-detail-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .task-time-details {
    font-size: 12px;
    line-height: 12px;
    color: #6f6f6f;
    margin: 4px 0px 0px 18px;
    display: flex;
    gap: 8px;
    align-items: center;
  }
`;

const getTaskScheduleSummary = (data: any, tasks: any, stages: any) => {
  const { startDateDuration, condition, type, referencedTaskId } = data;

  const task = tasks.get(referencedTaskId);
  const stage = stages.get(task.stageId);

  const timeSummary = getSummary(startDateDuration);

  if (type === ScheduledTaskType.JOB) {
    return `Task Scheduled to be started ${timeSummary} after Job starts`;
  } else {
    return `Task Scheduled to be started ${timeSummary} after Task ${stage.orderTree}.${
      task.orderTree
    } ${condition === ScheduledTaskCondition.START ? 'starts' : 'completes'}.`;
  }
};

const TaskNavCard: FC<{ task: any; taskNo: number; errors: string[]; stageNo: number }> = ({
  task,
  taskNo,
  errors,
  stageNo,
}) => {
  const dispatch = useDispatch();

  const {
    taskNavState: { current: activeTaskExecutionId },
    taskExecutions,
    tasks,
    stages,
  } = useTypedSelector((state) => state.job);

  const { enableScheduling, enableRecurrence } = task;

  const taskTimeFormat = 'dd/MM/yyyy hh:mm a';

  // The first task execution in the task is the master task execution and only master task can be scheduled.
  const masterTaskExecution = taskExecutions.get(task.taskExecutions[0]);

  const { id, type } = masterTaskExecution!;

  const getTaskSchedule = async (taskId: string) => {
    try {
      const { data } = await request('GET', apiTaskSchedule(taskId));
      if (data) {
        const summary = getTaskScheduleSummary(data, tasks, stages);
        dispatch(
          jobActions.updateTaskExecution({
            id: id,
            data: {
              scheduleTaskSummary: summary,
            },
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (enableScheduling && type === TaskExecutionType.MASTER) {
      getTaskSchedule(task.id);
    }
  }, []);

  return (
    <>
      {task?.taskExecutions?.map((taskExecutionId: any, taskExecutionIndex: number) => {
        const taskExecution = taskExecutions.get(taskExecutionId);
        const {
          state,
          type,
          continueRecurrence,
          recurringExpectedStartedAt,
          recurringExpectedDueAt,
          schedulingExpectedStartedAt,
          schedulingExpectedDueAt,
          endedAt,
          scheduleTaskSummary,
        } = taskExecution || {};

        const isError = !!errors.length;
        const backgroundColor =
          taskExecutionId === activeTaskExecutionId
            ? isError
              ? '#FFF1F1'
              : '#e7f1fd'
            : isError
            ? '#FFF1F1'
            : '#ffffff';
        const nameColor = state in COMPLETED_TASK_STATES ? '#C2C2C2' : '#161616';
        const isTaskStarted = state in COMPLETED_TASK_STATES || state in IN_PROGRESS_TASK_STATES;

        const actualTaskEndDate = endedAt || getUnixTime(new Date());

        return (
          <TaskDetailCardWrapper
            key={taskExecutionId}
            onClick={() => {
              dispatch(
                jobActions.navigateByTaskId({
                  id: taskExecutionId,
                }),
              );
            }}
            backgroundColor={backgroundColor}
            error={isError && taskExecutionId === activeTaskExecutionId}
          >
            <div
              className="title"
              style={{
                marginLeft: type === TaskExecutionType.MASTER ? '0px' : '34px',
              }}
            >
              Task{' '}
              {type === TaskExecutionType.MASTER
                ? `${stageNo}.${taskNo}`
                : `${stageNo}.${taskNo}.${taskExecutionIndex}`}
            </div>
            <div>
              <div className="task-detail-right">
                <FiberManualRecord
                  className="icon"
                  style={{
                    fontSize: '0.625rem',
                    color: taskStateColor(state),
                  }}
                />
                <div style={{ color: nameColor }}>{task?.name}</div>
                {type === TaskExecutionType.REPEAT ? (
                  <Tooltip title={'Repeated Task'} arrow placement="right" textAlignment="left">
                    <img src={repeatTaskIcon} />
                  </Tooltip>
                ) : null}
                {enableRecurrence && type === TaskExecutionType.MASTER && (
                  <Tooltip
                    title={continueRecurrence ? 'Recurrence enabled' : 'Recurrence ended'}
                    arrow
                    placement="right"
                    textAlignment="left"
                  >
                    <span>
                      <img
                        src={continueRecurrence ? taskRecurrenceIcon : taskRecurrenceIconDisabled}
                      />
                    </span>
                  </Tooltip>
                )}
                {enableScheduling && (
                  <span>
                    {!isTaskStarted &&
                    schedulingExpectedStartedAt &&
                    schedulingExpectedDueAt &&
                    (getEpochTimeDifference(schedulingExpectedStartedAt) === 'ON TIME' ||
                      getEpochTimeDifference(schedulingExpectedStartedAt) === 'LATE') ? (
                      <Tooltip
                        title={'Task is ready to Start'}
                        arrow
                        placement="right"
                        textAlignment="left"
                      >
                        <img src={scheduleTaskIconActive} />
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title={scheduleTaskSummary ? scheduleTaskSummary : 'Task is scheduled'}
                        arrow
                        placement="right"
                        textAlignment="left"
                      >
                        <img src={scheduleTaskIcon} />
                      </Tooltip>
                    )}
                  </span>
                )}
              </div>
              {type === TaskExecutionType.RECURRING && (
                <div className="task-time-details">
                  <span>
                    {formatDateTime({ value: recurringExpectedStartedAt, format: taskTimeFormat })}
                  </span>
                  <img src={arrowIcon} />
                  {checkJobExecutionDelay(actualTaskEndDate, recurringExpectedDueAt) ? (
                    <Tooltip title={'Task in overdue'} arrow placement="right">
                      <span
                        style={{
                          color: '#DA1E28',
                        }}
                      >
                        {formatDateTime({ value: recurringExpectedDueAt, format: taskTimeFormat })}
                      </span>
                    </Tooltip>
                  ) : (
                    <span>
                      {formatDateTime({ value: recurringExpectedDueAt, format: taskTimeFormat })}
                    </span>
                  )}
                </div>
              )}
              {enableScheduling && schedulingExpectedStartedAt && schedulingExpectedDueAt && (
                <div className="task-time-details">
                  <span>
                    {formatDateTime({ value: schedulingExpectedStartedAt, format: taskTimeFormat })}
                  </span>
                  <img src={arrowIcon} />
                  {checkJobExecutionDelay(actualTaskEndDate, schedulingExpectedDueAt) ? (
                    <Tooltip title={'Task in overdue'} arrow placement="right">
                      <span
                        style={{
                          color: '#DA1E28',
                        }}
                      >
                        {formatDateTime({ value: schedulingExpectedDueAt, format: taskTimeFormat })}
                      </span>
                    </Tooltip>
                  ) : (
                    <span>
                      {formatDateTime({ value: schedulingExpectedDueAt, format: taskTimeFormat })}
                    </span>
                  )}
                </div>
              )}
            </div>
          </TaskDetailCardWrapper>
        );
      })}
    </>
  );
};

export default TaskNavCard;
