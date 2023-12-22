import { TaskExecutionState } from '#PrototypeComposer/checklist.types';
import { TaskExecutionType } from '../../../../src/types/task';
import { Task } from '#types';
import { formatDateTime, formatDuration } from '#utils/timeUtils';
import { Image, Link, StyleSheet, View } from '@react-pdf/renderer';
import React, { FC, useContext } from 'react';
import {
  getLabelDetails,
  getParameterDetails,
  getTaskExceptionDetails,
  isParameterNeeded,
} from '../Components/Documents/utils';
import { PrintContext } from './PrintContext';
import { TaskState } from './constant';
import { PdfTable, PdfText, tableStyles } from '#components/documents';
import { chunk } from 'lodash';

const taskStyles = StyleSheet.create({
  taskView: {
    paddingHorizontal: 20,
  },
  taskName: {
    fontWeight: 700,
  },
  taskHeader: {
    display: 'flex',
    paddingVertical: 8,
  },
  taskState: {
    fontSize: 10,
    textTransform: 'capitalize',
    color: '#666666',
    marginTop: 8,
  },
  timedTask: {
    fontSize: 10,
    paddingVertical: 2,
  },
  mediaContainer: {
    paddingVertical: 2,
  },
  imageStyleContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  imageStyle: {
    width: '100px',
    padding: '5px',
  },
  recurringTask: {
    marginBottom: 16,
  },
  exceptionLabel: {
    fontSize: 10,
    fontWeight: 700,
    paddingVertical: 2,
  },
  headerText: {
    fontSize: 11,
    fontWeight: 700,
  },
  superscript: {
    fontSize: 7,
    fontWeight: 700,
    verticalAlign: 'super',
  },
});

const MemoTask: FC<{
  task: Task;
  stageOrderTree: string;
}> = ({ task, stageOrderTree }) => {
  const COLUMNS_PER_PAGE = 3;

  const {
    startedAt,
    endedAt,
    state: taskExecutionState,
    correctionEnabled,
    correctionReason,
    startedBy,
    endedBy,
    type,
    orderTree,
  } = task.taskExecution || ({} as any);

  const {
    dateAndTimeStampFormat,
    extra: { hiddenIds },
  } = useContext(PrintContext);

  const taskExceptions = task.enableRecurrence ? getTaskExceptionDetails(task, stageOrderTree) : {};

  const taskName = (type: string, taskExecutionOrderTree?: any, isColumn: boolean = false) => {
    let exceptionLabel;
    if (type === TaskExecutionType.REPEAT || type === TaskExecutionType.RECURRING) {
      exceptionLabel = `E ${stageOrderTree}.${task.orderTree}.${
        parseInt(taskExecutionOrderTree) - 1
      }`;

      if (taskExceptions[exceptionLabel]) {
        return (
          <PdfText style={isColumn ? taskStyles.headerText : taskStyles.taskName}>
            Task {stageOrderTree}.{task.orderTree}.{parseInt(taskExecutionOrderTree) - 1} -{' '}
            {task.name} <PdfText style={taskStyles.superscript}>[{exceptionLabel}]</PdfText>
          </PdfText>
        );
      } else {
        return (
          <PdfText style={isColumn ? taskStyles.headerText : taskStyles.taskName}>
            Task {stageOrderTree}.{task.orderTree}.{parseInt(taskExecutionOrderTree) - 1} -{' '}
            {task.name}
          </PdfText>
        );
      }
    } else {
      exceptionLabel = `E ${stageOrderTree}.${task.orderTree}`;
      if (taskExceptions[exceptionLabel] && isColumn) {
        return (
          <PdfText style={isColumn ? taskStyles.headerText : taskStyles.taskName}>
            Task {stageOrderTree}.{task.orderTree} - {task.name}
            <PdfText style={taskStyles.superscript}>[{exceptionLabel}]</PdfText>
          </PdfText>
        );
      } else {
        return (
          <PdfText style={isColumn ? taskStyles.headerText : taskStyles.taskName}>
            Task {stageOrderTree}.{task.orderTree} - {task.name}
          </PdfText>
        );
      }
    }
  };

  return (
    <View style={taskStyles.taskView} key={`${task.id}`}>
      {task.enableRecurrence ? (
        <>
          <View style={taskStyles.taskHeader}>{taskName(TaskExecutionType.MASTER)}</View>
          {task.timed && (
            <View>
              {task.timerOperator === 'NOT_LESS_THAN' ? (
                <View>
                  <PdfText style={taskStyles.timedTask}>
                    Perform task in NLT {task.minPeriod && formatDuration(task.minPeriod)}
                  </PdfText>
                  <PdfText style={taskStyles.timedTask}>
                    Max Time limit - {task.maxPeriod && formatDuration(task.maxPeriod)}
                  </PdfText>
                </View>
              ) : (
                <PdfText style={taskStyles.timedTask}>
                  Complete under {task.maxPeriod && formatDuration(task.maxPeriod)}
                </PdfText>
              )}
            </View>
          )}
          {task.medias && !!task.medias.length && (
            <View style={taskStyles.mediaContainer}>
              <View style={taskStyles.imageStyleContainer}>
                <PdfText style={taskStyles.timedTask}>Attached Medias: </PdfText>
                {task.medias.map((medias, i) => (
                  <PdfText style={taskStyles.timedTask}>
                    <Link src={medias.link}>
                      {medias.name || medias.filename}
                      {i < task.medias.length - 1 ? ', ' : ''}
                    </Link>
                  </PdfText>
                ))}
              </View>
            </View>
          )}
          {chunk(task.taskExecutions, COLUMNS_PER_PAGE).map((taskExecutions) => {
            const columns = [
              { name: 'Attributes', id: 'attribute' },
              ...taskExecutions
                .filter((taskExecution: any) => !hiddenIds[taskExecution.id])
                .map((taskExecution: any) => ({
                  name: taskName(taskExecution.type, taskExecution.orderTree, true),
                  id: taskExecution.id,
                })),
            ];

            const taskStartRow = {
              attribute: 'Start Date/Time and done by',
              id: 'task-start',
              ...taskExecutions.reduce<Record<string, any>>((acc, taskExecution) => {
                acc[taskExecution.id] = () => {
                  return taskExecution.startedAt && taskExecution.startedBy ? (
                    <PdfText style={tableStyles.columnText}>
                      {`${formatDateTime({
                        value: taskExecution.startedAt,
                        format: dateAndTimeStampFormat,
                      })} by ${taskExecution.startedBy.firstName} ${
                        taskExecution.startedBy.lastName
                      } (ID: ${taskExecution.startedBy.employeeId})`}
                    </PdfText>
                  ) : (
                    <View style={tableStyles.commentsRow} />
                  );
                };
                return acc;
              }, {}),
            };

            const taskEndRow = {
              attribute: 'End Date/Time and done by',
              id: 'task-end',
              ...taskExecutions.reduce<Record<string, any>>((acc, taskExecution) => {
                acc[taskExecution.id] = () => {
                  return taskExecution.endedAt ? (
                    <PdfText style={tableStyles.columnText}>
                      {`${formatDateTime({
                        value: taskExecution.endedAt,
                        format: dateAndTimeStampFormat,
                      })} by ${taskExecution.endedBy.firstName} ${
                        taskExecution.endedBy.lastName
                      } (ID: ${taskExecution.endedBy.employeeId})`}
                    </PdfText>
                  ) : (
                    <View style={tableStyles.commentsRow} />
                  );
                };
                return acc;
              }, {}),
            };

            const taskStateRow = {
              attribute: 'Task State',
              id: 'task-state',
              ...taskExecutions.reduce<Record<string, any>>((acc, taskExecution) => {
                acc[taskExecution.id] = TaskState[taskExecution.state];
                return acc;
              }, {}),
            };

            const rows = task.parameters.map((parameter) => {
              const row: any = { attribute: getLabelDetails(parameter) };

              taskExecutions.forEach((taskExecution: any) => {
                const response = parameter.response.find(
                  (r) => r.taskExecutionId === taskExecution.id,
                );

                const _parameter = { ...parameter, response };

                row[taskExecution.id] = isParameterNeeded(_parameter, hiddenIds)
                  ? () => getParameterDetails(_parameter, taskExecution.state)
                  : '--';
              });

              return row;
            });

            return (
              <view style={taskStyles.recurringTask}>
                <PdfTable
                  columns={columns}
                  data={[taskStateRow, taskStartRow, ...rows, taskEndRow]}
                />
              </view>
            );
          })}
          {Object.keys(taskExceptions).length > 0 && (
            <view>
              {Object.keys(taskExceptions).map((exceptionLabel) => {
                if (taskExceptions[exceptionLabel].length > 0) {
                  return (
                    <view>
                      <PdfText style={taskStyles.exceptionLabel}>{exceptionLabel}</PdfText>
                      <PdfText style={taskStyles.timedTask}>
                        {taskExceptions[exceptionLabel]
                          .map((exception) => `${exception.exception}: ${exception.reason}`)
                          .join(', ')}
                      </PdfText>
                    </view>
                  );
                }
              })}
            </view>
          )}
        </>
      ) : (
        <>
          <View style={taskStyles.taskHeader}>
            <PdfText style={taskStyles.taskName}>{taskName(type, orderTree)}</PdfText>
            <PdfText style={taskStyles.taskState}>
              Task State : {TaskState[taskExecutionState]}
            </PdfText>
          </View>
          {task.timed && (
            <View>
              <View>
                {task.timerOperator === 'NOT_LESS_THAN' ? (
                  <View>
                    <PdfText style={taskStyles.timedTask}>
                      Perform task in NLT {task.minPeriod && formatDuration(task.minPeriod)}
                    </PdfText>
                    <PdfText style={taskStyles.timedTask}>
                      Max Time limit - {task.maxPeriod && formatDuration(task.maxPeriod)}
                    </PdfText>
                  </View>
                ) : (
                  <PdfText style={taskStyles.timedTask}>
                    Complete under {task.maxPeriod && formatDuration(task.maxPeriod)}
                  </PdfText>
                )}
              </View>
              <View>
                {task.taskExecution?.reason && (
                  <PdfText style={taskStyles.timedTask}>
                    Reason : {task.taskExecution.reason}
                  </PdfText>
                )}
              </View>
            </View>
          )}
          {correctionEnabled ? (
            <View>
              <PdfText style={taskStyles.timedTask}>
                Error Correction is Enabled, Reason : {correctionReason}
              </PdfText>
            </View>
          ) : correctionReason ? (
            <View>
              <PdfText style={taskStyles.timedTask}>Correction Reason: {correctionReason}</PdfText>
            </View>
          ) : null}
          {task?.taskExecution?.state === TaskExecutionState.COMPLETED_WITH_EXCEPTION && (
            <View>
              <PdfText style={taskStyles.timedTask}>
                Completed With Exception: {task.taskExecution.reason || ''}
              </PdfText>
            </View>
          )}
          {task?.taskExecution?.state === TaskExecutionState.SKIPPED && (
            <View>
              <PdfText style={taskStyles.timedTask}>
                Task Skipped: {task.taskExecution.reason || ''}
              </PdfText>
            </View>
          )}
          {task.medias &&
            !!task.medias.length &&
            (task?.taskExecution?.state === TaskExecutionState.COMPLETED ||
            task?.taskExecution?.state === TaskExecutionState.COMPLETED_WITH_EXCEPTION ? (
              <View style={taskStyles.mediaContainer}>
                <View style={taskStyles.imageStyleContainer}>
                  <PdfText style={taskStyles.timedTask}>Attached Medias: </PdfText>
                  {task.medias.map((medias, i) => (
                    <PdfText style={taskStyles.timedTask}>
                      <Link src={medias.link}>
                        {medias.name || medias.filename}
                        {i < task.medias.length - 1 ? ', ' : ''}
                      </Link>
                    </PdfText>
                  ))}
                </View>
              </View>
            ) : (
              <View style={taskStyles.mediaContainer}>
                <PdfText style={taskStyles.timedTask}>Attached Medias: </PdfText>
                <View style={taskStyles.imageStyleContainer}>
                  {task.medias.map((medias) => (
                    <Image src={medias.link} style={taskStyles.imageStyle} />
                  ))}
                </View>
              </View>
            ))}
          <PdfTable
            columns={[
              { name: 'Attribute', id: 'attribute' },
              { name: 'Details/Value', id: 'value' },
            ]}
            data={[
              {
                attribute: 'Start Date/Time and done by',
                value: () => {
                  return startedAt && startedBy ? (
                    <PdfText style={tableStyles.columnText}>{`${formatDateTime({
                      value: startedAt,
                      format: dateAndTimeStampFormat,
                    })} by ${startedBy.firstName} ${startedBy.lastName} (ID: ${
                      startedBy.employeeId
                    })`}</PdfText>
                  ) : (
                    <View style={tableStyles.commentsRow} />
                  );
                },
                id: 'task-start',
              },
              ...task.parameters.reduce((acc, p) => {
                if (isParameterNeeded(p, hiddenIds)) {
                  acc.push({
                    attribute: getLabelDetails(p),
                    value: () => getParameterDetails(p, taskExecutionState),
                  });
                }
                return acc;
              }, [] as any[]),
              {
                attribute: 'End Date/Time and done by',
                value: () => {
                  return endedAt ? (
                    <PdfText style={tableStyles.columnText}>{`${formatDateTime({
                      value: endedAt,
                      format: dateAndTimeStampFormat,
                    })} by ${endedBy.firstName} ${endedBy.lastName} (ID: ${
                      endedBy.employeeId
                    })`}</PdfText>
                  ) : (
                    <View style={tableStyles.commentsRow} />
                  );
                },
                id: 'task-end',
              },
            ]}
          />
        </>
      )}
    </View>
  );
};

const PrintTask = React.memo(MemoTask);

export default PrintTask;
