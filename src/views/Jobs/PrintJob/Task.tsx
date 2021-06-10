import React, { FC } from 'react';
import {
  TaskExecutionState,
  Task,
  NonMandatoryActivity,
  TimerOperator,
  CompletedTaskStates,
} from '#JobComposer/checklist.types';
import handIcon from '#assets/images/hand.png';
import clockIcon from '#assets/images/clock.png';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ActivityList from './ActivityList';
import moment from 'moment';
import { formatDuration } from '#utils/timeUtils';

const styles = StyleSheet.create({
  flexView: {
    display: 'flex',
    flex: 1,
  },
  taskView: {
    paddingTop: 8,
    paddingHorizontal: 40,
  },
  taskHeader: {
    display: 'flex',
  },
  taskTopHeader: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#eeeeee',
    width: '43%',
  },
  taskTopHeaderTitle: {
    fontSize: 12,
    fontFamily: 'Nunito',
  },
  taskBottomHeader: {
    padding: 16,
    backgroundColor: '#dadada',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskHasTimed: {
    paddingTop: 10,
    paddingBottom: 16,
    paddingLeft: 16,
    backgroundColor: '#dadada',
    borderTopWidth: 1,
    borderTopColor: '#bababa',
  },
  taskHasStopHeader: {
    paddingVertical: 13,
    backgroundColor: '#bababa',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskStartTime: {
    marginLeft: 24,
  },
  taskStartDateInput: {
    fontSize: 10,
    letterSpacing: 0,
    fontFamily: 'Nunito',
  },
  taskTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Nunito',
    textOverflow: 'hidden',
  },
  taskFooter: {
    display: 'flex',
    paddingVertical: 8,
    paddingTop: 16,
  },
  taskFooterInputs: {
    borderWidth: 1,
    borderColor: '#000',
    minHeight: 20,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  taskFooterLabel: {
    fontSize: 12,
    marginBottom: 0,
    fontFamily: 'Nunito',
  },
  text12: {
    fontSize: 12,
    fontFamily: 'Nunito',
  },
  comments: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#000',
  },
  lightInput: {
    marginHorizontal: 1,
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
});

const MemoTask: FC<{ task: Task; taskIndex: number }> = ({
  task,
  taskIndex,
}) => {
  const {
    startedAt,
    audit: { modifiedBy, modifiedAt },
    state: taskExecutionState,
  } = task.taskExecution;

  const canSkipTask = !task.activities.reduce((acc, activity) => {
    if (
      activity.type === NonMandatoryActivity.INSTRUCTION ||
      activity.type === NonMandatoryActivity.MATERIAL
    ) {
      return acc;
    }
    acc = acc || activity.mandatory;
    return acc;
  }, false);

  return (
    <View style={styles.taskView} key={`${task.id}`}>
      <View style={styles.taskHeader} wrap={false}>
        <View style={styles.taskTopHeader}>
          <View style={styles.taskStartDate}>
            <Text style={styles.taskTopHeaderTitle}>Start Date</Text>
            <Text
              style={[
                styles.taskStartDateInput,
                {
                  letterSpacing: 2.5,
                  margin: '8px 0px 2px 0px',
                },
              ]}
            >
              {taskExecutionState !== TaskExecutionState.NOT_STARTED &&
              startedAt
                ? moment.unix(startedAt).format('MMM DD YYYY')
                : '___/__/____'}
            </Text>
            <Text style={styles.taskStartDateInput}>
              MMM&nbsp;&nbsp;DD&nbsp;&nbsp;&nbsp;YYYY
            </Text>
          </View>
          <View style={styles.taskStartTime}>
            <Text style={styles.taskTopHeaderTitle}>Start Time</Text>
            <Text
              style={[
                styles.taskStartDateInput,
                {
                  letterSpacing: 2.6,
                  margin: '8px 0px 2px 0px',
                },
              ]}
            >
              {taskExecutionState !== TaskExecutionState.NOT_STARTED &&
              startedAt
                ? moment.unix(startedAt).format('h:mm a')
                : '__:__ am / pm'}
            </Text>
            <Text style={styles.taskStartDateInput}>HH&nbsp;&nbsp;MM</Text>
          </View>
        </View>
        {task.hasStop && (
          <View style={styles.taskHasStopHeader}>
            <Image src={handIcon} style={{ height: '20px', marginRight: 8 }} />
            <Text style={[styles.text12, { fontWeight: 600 }]}>
              Complete this task before proceeding to the next task.
            </Text>
          </View>
        )}
        <View style={styles.taskBottomHeader}>
          <Text style={[styles.taskTitle, { maxWidth: '80%' }]}>
            Task {`${task.orderTree}. ${task.name}`}
          </Text>
          <Text style={styles.taskTitle}>
            {!canSkipTask ? `Mandatory` : `Optional`}
          </Text>
        </View>
        {task.timed && (
          <View>
            <View style={styles.taskHasTimed}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Image
                  src={clockIcon}
                  style={{ height: '18px', marginRight: 8 }}
                />
                <Text style={[styles.text12, { display: 'flex' }]}>
                  {task.timerOperator === TimerOperator.NOT_LESS_THAN
                    ? `Perform task in Not Less Than ${formatDuration(
                        task.minPeriod as number,
                      )} :: Max Time limit - ${formatDuration(
                        task?.maxPeriod as number,
                      )}`
                    : `Complete under ${formatDuration(
                        task.maxPeriod as number,
                      )}`}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
      <ActivityList activities={task.activities} />

      {taskExecutionState === TaskExecutionState.COMPLETED && (
        <View style={styles.taskFooter} wrap={false}>
          <Text style={styles.text12}>
            This Task was digitally completed via CLEEN {'\n'}
            by {modifiedBy.firstName} {modifiedBy.lastName}, ID:{' '}
            {modifiedBy.employeeId} on{' '}
            {moment.unix(modifiedAt).format('MMM DD, h:mm A')}
          </Text>
        </View>
      )}
      {(taskExecutionState === TaskExecutionState.COMPLETED_WITH_CORRECTION ||
        taskExecutionState === TaskExecutionState.ENABLED_FOR_CORRECTION) && (
        <View style={styles.taskFooter} wrap={false}>
          <Text style={styles.text12}>
            This Task was Completed with Correction via CLEEN {'\n'}
            by {modifiedBy.firstName} {modifiedBy.lastName}, ID:{' '}
            {modifiedBy.employeeId} on{' '}
            {moment.unix(modifiedAt).format('MMM DD, h:mm A')}
          </Text>
          <View style={styles.comments}>
            <Text style={styles.text12}>
              {task.taskExecution.correctionReason}
            </Text>
          </View>
        </View>
      )}
      {(taskExecutionState === TaskExecutionState.COMPLETED_WITH_EXCEPTION ||
        taskExecutionState === TaskExecutionState.SKIPPED) && (
        <View style={styles.taskFooter} wrap={false}>
          <Text style={styles.text12}>
            This Task was
            {taskExecutionState === TaskExecutionState.COMPLETED_WITH_EXCEPTION
              ? ' Completed with Exception '
              : ' skipped '}
            via CLEEN {'\n'}
            by {modifiedBy.firstName} {modifiedBy.lastName}, ID:{' '}
            {modifiedBy.employeeId} on{' '}
            {moment.unix(modifiedAt).format('MMM DD, h:mm A')}
          </Text>
          <View style={styles.comments}>
            <Text style={styles.text12}>{task.taskExecution.reason}</Text>
          </View>
        </View>
      )}
      {(taskExecutionState === TaskExecutionState.NOT_STARTED ||
        taskExecutionState === TaskExecutionState.IN_PROGRESS) && (
        <View
          style={[styles.taskFooter, { flexDirection: 'row' }]}
          wrap={false}
        >
          <View style={styles.flexView}>
            <Text style={styles.taskFooterLabel}>First Name</Text>
            <View style={styles.taskFooterInputs}>
              <Text style={styles.text12} />
            </View>
            <Text style={[styles.taskFooterLabel, { marginTop: 5 }]}>
              Last Name
            </Text>
            <View style={styles.taskFooterInputs}>
              <Text style={styles.text12} />
            </View>
          </View>
          <View style={[styles.flexView, { margin: '0px 4px' }]}>
            <View
              style={{
                paddingLeft: 40,
              }}
            >
              <Text style={styles.taskTopHeaderTitle}>End Date</Text>
              <Text
                style={[
                  styles.taskStartDateInput,
                  {
                    letterSpacing: 2.8,
                    margin: '8px 0px 2px 0px',
                  },
                ]}
              >
                ___/__/____
              </Text>
              <Text style={styles.taskStartDateInput}>
                MMM&nbsp;&nbsp;DD&nbsp;&nbsp;&nbsp;YYYY
              </Text>
            </View>
          </View>
          <View style={[styles.flexView, { margin: '0px 4px' }]}>
            <View style={{ paddingLeft: 20 }}>
              <Text style={styles.taskTopHeaderTitle}>End Time</Text>
              <Text
                style={[
                  styles.taskStartDateInput,
                  {
                    letterSpacing: 2.6,
                    margin: '8px 0px 2px 0px',
                  },
                ]}
              >
                __:__ am / pm
              </Text>
              <Text style={styles.taskStartDateInput}>HH&nbsp;&nbsp;MM</Text>
            </View>
          </View>
          <View style={[styles.flexView, { margin: '0px 4px' }]}>
            <Text style={styles.taskFooterLabel}>Signature</Text>
            <View style={[styles.taskFooterInputs, { minHeight: 50 }]}>
              <Text style={styles.text12} />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const Task = React.memo(MemoTask);

export default Task;
