import { PARAMETER_OPERATORS } from '#PrototypeComposer/constants';
import { getUserName } from '#services/users';
import { formatDuration1 } from '#utils/timeUtils';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import moment from 'moment';
import React, { Fragment, ReactNode } from 'react';

import {
  Exception,
  Exceptions,
  JobSummary,
  ParameterDeviation,
  Timer,
} from '../Summary/types';
import { styles as baseStyles } from './styles';
import TableRow from './TableRow';

type Props = Pick<JobSummary, 'stages' | 'totalTaskExceptions'>;

const isEven = (n: number) => n % 2 === 0;

const generateDescription = (exception: Exception): ReactNode => {
  let description: ReactNode;

  switch (exception.type) {
    case 'DURATION_EXCEPTION':
      const {
        endedAt,
        maxPeriod,
        minPeriod,
        startedAt,
        timerOperator,
      } = exception.timer as Timer;

      const taskStartTime = moment.unix(startedAt);

      const taskCompleteTime = moment.unix(endedAt);

      const taskDuration = taskCompleteTime.diff(taskStartTime, 's');

      const deviation =
        taskDuration -
        (timerOperator === 'NOT_LESS_THAN' ? minPeriod : maxPeriod);

      const expectedString =
        timerOperator === 'NOT_LESS_THAN'
          ? `NLT ${formatDuration1({ duration: minPeriod ?? 0, unit: 's' })}.`
          : `Complete under ${formatDuration1({
              duration: maxPeriod ?? 0,
              unit: 's',
            })}`;

      description = `Task Completed ${formatDuration1({
        duration: Math.abs(deviation) ?? 0,
        unit: 's',
      })} ${deviation > 0 ? 'late' : 'early'}. Expected: ${expectedString}. ${
        timerOperator === 'NOT_LESS_THAN'
          ? `Max Time : ${formatDuration1({
              duration: maxPeriod ?? 0,
              unit: 's',
            })}`
          : null
      }`;

      break;

    case 'PARAMETER_DEVIATION':
      const {
        activity: { operator, parameter, uom, value },
        userInput,
      } = exception.parameterDeviation as ParameterDeviation;

      description = `${parameter} is off limits. Expected value ${
        PARAMETER_OPERATORS.find((el) => el.value === operator)?.label
      } ${value} ${uom}. Observed value ${userInput} ${uom}.`;

      break;

    case 'COMPLETED_WITH_EXCEPTION':
      description = 'Task completed with exception';
      break;

    case 'SKIPPED':
      description = 'Task skipped with remarks';
      break;

    case 'ERROR_CORRECTION':
      description = 'Task data corrected with remarks';
      break;

    default:
      description = '';
  }
  return description;
};

const styles = StyleSheet.create({
  exceptionSummary: {
    backgroundColor: '#f4f4f4',
    borderRadius: 4,
    marginTop: 24,
  },

  exceptionSummaryTitle: {
    backgroundColor: '#000',
    borderTopLeftRadius: 4,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'normal',
    textAlign: 'left',
    padding: 4,
    width: 180,
  },

  totalExceptionCount: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
    padding: 4,
    textAlign: 'left',
  },

  taskOrder: {
    fontWeight: 'bold',
  },
});

const ExceptionSummary = ({ stages, totalTaskExceptions }: Props) => (
  <View break style={styles.exceptionSummary}>
    <View fixed>
      <Text style={styles.exceptionSummaryTitle}>Exception Summary</Text>

      {stages?.length ? (
        <Text style={styles.totalExceptionCount}>
          Total No of Exceptions : {totalTaskExceptions}
        </Text>
      ) : null}
    </View>

    {stages?.length ? (
      <View style={baseStyles.table}>
        <TableRow
          fixed
          columns={[
            {
              text: 'Stage/Task Name',
              customStyle: {
                color: '#fff',
                flex: 2,
                paddingVertical: 4,
                textAlign: 'left',
              },
            },
            {
              text: 'Type of Exception',
              customStyle: {
                color: '#fff',
                paddingVertical: 4,
                textAlign: 'left',
              },
            },
            {
              text: 'Description',
              customStyle: {
                color: '#fff',
                paddingVertical: 4,
                textAlign: 'left',
              },
            },
            {
              text: 'Initiator',
              customStyle: {
                color: '#fff',
                paddingVertical: 4,
                textAlign: 'left',
              },
            },
            {
              text: 'User Remarks',
              customStyle: {
                color: '#fff',
                paddingVertical: 4,
                textAlign: 'left',
              },
            },
          ]}
          customStyle={{ backgroundColor: '#666' }}
        />

        {stages.map((stage) => {
          const {
            id: stageId,
            name: stageName,
            orderTree: stageOrderTree,
            tasks,
            totalTaskExceptions,
          } = stage;

          if (totalTaskExceptions) {
            return (
              <Fragment key={stageId}>
                <TableRow
                  columns={[
                    {
                      text: `Stage ${stageOrderTree} : ${stageName}`,
                      customStyle: { textAlign: 'left' },
                    },
                  ]}
                  customStyle={{ backgroundColor: '#fff' }}
                />

                {tasks.map((task) => {
                  const {
                    exceptions,
                    id: taskId,
                    name: taskName,
                    orderTree: taskOrderTree,
                  } = task;

                  if (exceptions.length) {
                    return exceptions.map((exception, index) => (
                      <TableRow
                        columns={[
                          {
                            text: (
                              <View
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  flex: 2,
                                  fontSize: 10,
                                  paddingHorizontal: 4,
                                  paddingVertical: 8,
                                }}
                              >
                                <Text style={styles.taskOrder}>
                                  Task {stageOrderTree}.{taskOrderTree}
                                </Text>
                                <Text>{taskName}</Text>
                              </View>
                            ),
                          },
                          {
                            text: Exceptions[exception.type],
                            customStyle: { textAlign: 'left' },
                          },
                          {
                            text: generateDescription(exception),
                            customStyle: { textAlign: 'left' },
                          },
                          {
                            text: getUserName({
                              user: exception.initiator,
                              withEmployeeId: true,
                            }),
                            customStyle: { textAlign: 'left' },
                          },
                          {
                            text: exception.remark,
                            customStyle: { textAlign: 'left' },
                          },
                        ]}
                        customStyle={
                          !isEven(index) ? { backgroundColor: '#fff' } : {}
                        }
                        key={`${taskId}-${index}`}
                      />
                    ));
                  }

                  return null;
                })}
              </Fragment>
            );
          }

          return null;
        })}
      </View>
    ) : (
      <Text style={baseStyles.defaultSummaryText}>
        There is no Exception summary. Job was completed with exception
      </Text>
    )}
  </View>
);

export default ExceptionSummary;
