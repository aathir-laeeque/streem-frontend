import { useTypedSelector } from '#store';
import { COMPLETED_TASK_STATES, IN_PROGRESS_TASK_STATES, TaskExecutionType } from '#types';
import { jobActions } from '#views/Job/jobStore';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import taskRecurrenceIcon from '#assets/svg/task-recurrence-icon.svg';
import AccordianIcon from '#assets/svg/accordianIcon.svg';
import repeatIcon from '#assets/svg/repeatIcon.svg';
import taskRecurrenceIconDisabled from '#assets/svg/task-recurrence-grey.svg';
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
import { taskStateColor, taskStateText } from '#utils/jobMethods';
import DoneIcon from '@material-ui/icons/Done';
import { PanTool } from '@material-ui/icons';

const TaskDetailCardWrapper = styled.div.attrs({
  className: 'task-detail-card-wrapper',
})<{ backgroundColor?: string; error: boolean }>`
  display: flex;
  align-items: center;
  gap: 50px;
  background-color: #ffffff;
  width: 100%;
  cursor: pointer;
  margin: 0px 10px;
  background-color: ${({ backgroundColor }) => `${backgroundColor}`};

  :hover {
    background-color: #e7f1fd;
  }

  .title {
    white-space: nowrap;
    color: ${({ error }) => `${error ? '#DA1E28' : 'unset'}`};
  }
  .task-outer-container {
    display: flex;
    cursor: pointer;
    .task-accordian-container {
      width: 28px;
      .accordian-image {
        margin: 4px 8px;
        cursor: pointer;
      }
      .accordian-image-rotate {
        margin: 4px 8px;
        cursor: pointer;
        transform: rotate(-90deg);
      }
    }
  }

  .task-detail-container {
    padding: 10px 16px 6px 16px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    width: 100%;
    .task-title-container {
      display: flex;
      justify-content: space-between;
      width: 100%;
      .task-top-container {
        display: flex;
        .title {
          white-space: nowrap;
          color: #6f6f6f;
          display: flex;
        }
        .task-detail-name-container {
          margin: 8px 0;
        }
        .recurrence-icon {
          margin-left: 10px;
          width: 16px;
        }
        .icon-container {
          margin-left: 10px;
          width: 16px;
        }
      }
    }
  }

  .task-detail-right {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: space-between;
  }

  .task-time-details {
    font-size: 12px;
    line-height: 12px;
    color: #6f6f6f;
    margin: 4px 0px 0px 0px;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .overdue-task-timing {
    color: #da1e28;
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
  const [accordianStatus, setAccordianStatus] = React.useState<boolean>(true);

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
            {((!accordianStatus && type === TaskExecutionType.MASTER) || accordianStatus) && (
              <div className="task-detail-container">
                <div className="task-title-container">
                  <div className="task-top-container">
                    <div
                      className="task-outer-container"
                      onClick={() => setAccordianStatus(!accordianStatus)}
                    >
                      <div className="task-accordian-container">
                        {task?.taskExecutions?.length > 1 && type === TaskExecutionType.MASTER && (
                          <img
                            className={`${
                              accordianStatus ? 'accordian-image' : 'accordian-image-rotate'
                            }`}
                            src={AccordianIcon}
                            alt="accordian-icon"
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      <div
                        className="title"
                        style={{ marginLeft: type === TaskExecutionType.MASTER ? '0px' : '34px' }}
                      >
                        <div>
                          Task{' '}
                          {type === TaskExecutionType.MASTER
                            ? `${stageNo}.${taskNo}`
                            : `${stageNo}.${taskNo}.${taskExecutionIndex}`}
                        </div>
                        <div className="icon-container">
                          {enableRecurrence && type === TaskExecutionType.MASTER ? (
                            <Tooltip
                              title={continueRecurrence ? 'Recurrence enabled' : 'Recurrence ended'}
                              arrow
                              placement="right"
                              textAlignment="left"
                            >
                              <span>
                                <img
                                  src={
                                    continueRecurrence
                                      ? taskRecurrenceIcon
                                      : taskRecurrenceIconDisabled
                                  }
                                  style={{ marginRight: '4px' }}
                                />
                              </span>
                            </Tooltip>
                          ) : null}
                          {type === TaskExecutionType.REPEAT ? (
                            <Tooltip
                              title={'Repeated Task'}
                              arrow
                              placement="right"
                              textAlignment="left"
                            >
                              <span>
                                <img src={repeatIcon} style={{ marginRight: '4px' }} />
                              </span>
                            </Tooltip>
                          ) : null}
                          {enableScheduling &&
                          schedulingExpectedStartedAt &&
                          schedulingExpectedDueAt ? (
                            <span>
                              {!isTaskStarted &&
                              enableScheduling &&
                              schedulingExpectedStartedAt &&
                              (getEpochTimeDifference(schedulingExpectedStartedAt) === 'ON TIME' ||
                                getEpochTimeDifference(schedulingExpectedStartedAt) === 'LATE') ? (
                                <Tooltip
                                  title={'Task is ready to Start'}
                                  arrow
                                  placement="right"
                                  textAlignment="left"
                                >
                                  <img
                                    src={scheduleTaskIconActive}
                                    style={{ marginRight: '4px' }}
                                  />
                                </Tooltip>
                              ) : (
                                <Tooltip
                                  title={
                                    scheduleTaskSummary ? scheduleTaskSummary : 'Task is scheduled'
                                  }
                                  arrow
                                  placement="right"
                                  textAlignment="left"
                                >
                                  <img src={scheduleTaskIcon} style={{ marginRight: '4px' }} />
                                </Tooltip>
                              )}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div
                        className="task-detail-name-container"
                        style={{ marginLeft: type === TaskExecutionType.MASTER ? '0px' : '34px' }}
                      >
                        <div style={{ color: nameColor, fontWeight: '600' }}>{task?.name}</div>
                      </div>
                      {type === TaskExecutionType.RECURRING ? (
                        <div className="task-time-details" style={{ marginLeft: '34px' }}>
                          <span
                            className={`${
                              checkJobExecutionDelay(actualTaskEndDate, schedulingExpectedDueAt)
                                ? 'overdue-task-timing'
                                : ''
                            }`}
                          >
                            {formatDateTime({
                              value: recurringExpectedStartedAt,
                              format: taskTimeFormat,
                            })}
                          </span>
                          <img src={arrowIcon} />
                          {checkJobExecutionDelay(actualTaskEndDate, recurringExpectedDueAt) ? (
                            <Tooltip title={'Task is overdue'} arrow placement="right">
                              <span className="overdue-task-timing">
                                {formatDateTime({
                                  value: recurringExpectedDueAt,
                                  format: taskTimeFormat,
                                })}
                              </span>
                            </Tooltip>
                          ) : (
                            <span>
                              {formatDateTime({
                                value: recurringExpectedDueAt,
                                format: taskTimeFormat,
                              })}
                            </span>
                          )}
                        </div>
                      ) : null}
                      {enableScheduling &&
                      schedulingExpectedStartedAt &&
                      schedulingExpectedDueAt ? (
                        <div
                          className="task-time-details"
                          style={{ marginLeft: type === TaskExecutionType.MASTER ? '0px' : '34px' }}
                        >
                          <span
                            className={`${
                              checkJobExecutionDelay(actualTaskEndDate, schedulingExpectedDueAt)
                                ? 'overdue-task-timing'
                                : ''
                            }`}
                          >
                            {formatDateTime({
                              value: schedulingExpectedStartedAt,
                              format: taskTimeFormat,
                            })}
                          </span>
                          <img src={arrowIcon} />
                          {checkJobExecutionDelay(actualTaskEndDate, schedulingExpectedDueAt) ? (
                            <Tooltip title={'Task is overdue'} arrow placement="right">
                              <span className="overdue-task-timing">
                                {formatDateTime({
                                  value: schedulingExpectedDueAt,
                                  format: taskTimeFormat,
                                })}
                              </span>
                            </Tooltip>
                          ) : (
                            <span>
                              {' '}
                              {formatDateTime({
                                value: schedulingExpectedDueAt,
                                format: taskTimeFormat,
                              })}
                            </span>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="task-detail-right">
                    {task.hasStop && (
                      <div>
                        <PanTool className="icon" style={{ color: '#f2c94c', width: '16px' }} />
                      </div>
                    )}
                    <Tooltip title={taskStateText(state)} arrow placement="right">
                      <DoneIcon style={{ color: taskStateColor(state) }} />
                    </Tooltip>
                  </div>
                </div>
              </div>
            )}
          </TaskDetailCardWrapper>
        );
      })}
    </>
  );
};

export default TaskNavCard;
