import React, { FC } from 'react';
import {
  TaskExecutionState,
  Task,
  NonMandatoryActivity,
} from '../../../Composer/checklist.types';
import handIcon from '#assets/images/hand.png';
import clockIcon from '#assets/images/clock.png';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ActivityList from './ActivityList';
import moment from 'moment';

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
    flexDirection: 'row',
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
    marginBottom: 4,
    fontFamily: 'Nunito',
  },
  text12: {
    fontSize: 12,
    fontFamily: 'Nunito',
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
            Task {`${taskIndex + 1}. ${task.name}`}
          </Text>
          <Text style={styles.taskTitle}>
            {!canSkipTask ? `Mandatory` : `Optional`}
          </Text>
        </View>
        {task.timed && task.period && (
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
                <Text style={styles.text12}>
                  Perform Task NLT{' '}
                  {`${Math.floor(
                    (task.period / (1000 * 60)) % 60,
                  )} min : ${Math.floor((task.period / 1000) % 60)} sec `}
                </Text>
              </View>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 8,
                alignItems: 'center',
              }}
            >
              <Text style={[styles.text12, { color: '#666666' }]}>
                Write values in box E.g. -{' '}
              </Text>
              <View style={styles.lightInput} />
              <View style={styles.lightInput} />
              <View style={styles.lightInput} />
              <View style={styles.lightInput} />
              <View
                style={{
                  width: 2,
                  height: 18,
                  marginHorizontal: 1,
                  borderBottomWidth: 1,
                  borderBottomColor: '#000',
                }}
              />
              <View style={styles.lightInput} />
              <View style={styles.lightInput} />
            </View>
          </View>
        )}
      </View>
      <ActivityList activities={task.activities} />

      {taskExecutionState !== TaskExecutionState.NOT_STARTED ? (
        <View style={styles.taskFooter} wrap={false}>
          <Text style={styles.text12}>
            This Task was digitally completed via CLEEN {'\n'}
            by {modifiedBy.firstName} {modifiedBy.lastName}, ID:{' '}
            {modifiedBy.employeeId} on{' '}
            {moment.unix(modifiedAt).format('MMM DD, h:mm A')}
          </Text>
        </View>
      ) : (
        <View style={styles.taskFooter} wrap={false}>
          <View style={styles.flexView}>
            <Text style={styles.taskFooterLabel}>First Name</Text>
            <View style={styles.taskFooterInputs}>
              <Text style={styles.text12} />
            </View>
          </View>
          <View style={[styles.flexView, { margin: '0px 4px 0px 8px' }]}>
            <Text style={styles.taskFooterLabel}>Last Name</Text>
            <View style={styles.taskFooterInputs}>
              <Text style={styles.text12} />
            </View>
          </View>
          <View style={[styles.flexView, { margin: '0px 4px' }]}>
            <Text style={styles.taskFooterLabel}>Signature</Text>
            <View style={[styles.taskFooterInputs, { minHeight: 50 }]}>
              <Text style={styles.text12} />
            </View>
          </View>
          <View style={[styles.flexView, { margin: '0px 4px' }]}>
            <Text style={styles.taskFooterLabel}>Date</Text>
            <Text
              style={[
                styles.taskStartDateInput,
                {
                  letterSpacing: 2.6,
                  margin: '8px 0px 2px 0px',
                },
              ]}
            >
              ___/__/____
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const Task = React.memo(MemoTask);

export default Task;
