import { TaskExecutionState } from '#PrototypeComposer/checklist.types';
import { TaskExecutionType } from '../../../../src/types/task';
import { Task } from '#types';
import { formatDateTime, formatDuration } from '#utils/timeUtils';
import { Image, Link, StyleSheet, View } from '@react-pdf/renderer';
import React, { FC, useContext } from 'react';
import {
  getLabelDetails,
  getParameterDetails,
  isParameterNeeded,
} from '../Components/Documents/utils';
import { PrintContext } from './PrintContext';
import { TaskState } from './constant';
import { PdfTable, PdfText, tableStyles } from '#components/documents';

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
});

const MemoTask: FC<{
  task: Task;
  stageOrderTree: string;
}> = ({ task, stageOrderTree }) => {
  const {
    startedAt,
    endedAt,
    state: taskExecutionState,
    correctionEnabled,
    correctionReason,
    startedBy,
    endedBy,
    type,
  } = task.taskExecution;

  const {
    dateAndTimeStampFormat,
    extra: { hiddenIds },
  } = useContext(PrintContext);

  const taskName = () => {
    if (type === TaskExecutionType.REPEAT || type === TaskExecutionType.RECURRING) {
      return `Task ${stageOrderTree}.${task.orderTree}.${
        parseInt(task.taskExecution.orderTree) - 1
      } - ${task.name}`;
    } else {
      return `Task ${stageOrderTree}.${task.orderTree} - ${task.name}`;
    }
  };

  return (
    <View style={taskStyles.taskView} key={`${task.id}`}>
      <View style={taskStyles.taskHeader}>
        <PdfText style={taskStyles.taskName}>{taskName()}</PdfText>
        <PdfText style={taskStyles.taskState}>Task State : {TaskState[taskExecutionState]}</PdfText>
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
                  Max Time limit - {task.maxPeriod && formatDuration(task?.maxPeriod)}
                </PdfText>
              </View>
            ) : (
              <PdfText style={taskStyles.timedTask}>
                Complete under {task.maxPeriod && formatDuration(task?.maxPeriod)}
              </PdfText>
            )}
          </View>
          <View>
            {task.taskExecution?.reason && (
              <PdfText style={taskStyles.timedTask}>Reason : {task.taskExecution?.reason}</PdfText>
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
            Completed With Exception: {task.taskExecution?.reason || ''}
          </PdfText>
        </View>
      )}
      {task?.taskExecution?.state === TaskExecutionState.SKIPPED && (
        <View>
          <PdfText style={taskStyles.timedTask}>
            Task Skipped: {task.taskExecution?.reason || ''}
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
    </View>
  );
};

const PrintTask = React.memo(MemoTask);

export default PrintTask;
