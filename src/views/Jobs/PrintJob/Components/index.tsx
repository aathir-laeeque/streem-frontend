import React, { ReactNode } from 'react';
import { User } from '#store/users/types';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { JobState } from '#Composer/composer.types';
import { styles as commonStyles } from '../styles';

const styles = StyleSheet.create({
  tabLook: {
    display: 'flex',
    paddingVertical: 8,
  },
  tabLookHeaderText: {
    fontSize: 12,
    color: '#ffffff',
    backgroundColor: '#000',
    minWidth: 155,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    fontFamily: 'Nunito',
  },
  tabLookBody: {
    display: 'flex',
    backgroundColor: '#f4f4f4',
    padding: '4px 40px 4px 10px',
  },
  labelInputGroupView: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 4,
    alignItems: 'center',
  },
  inputView: {
    borderWidth: 1,
    borderColor: '#000',
    display: 'flex',
    flex: 1,
    marginLeft: 7,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 22,
  },
  assignView: {
    display: 'flex',
    flex: 1,
    marginLeft: 7,
    paddingHorizontal: 8,
  },
  assigneInput: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 4,
    paddingHorizontal: 8,
    minHeight: 20,
    display: 'flex',
    flex: 1,
  },
  assigneRow: {
    flexDirection: 'row',
    display: 'flex',
    marginVertical: 4,
  },
  assigneHeading: {
    fontSize: 10,
    fontFamily: 'Nunito',
  },
  inputLabelView: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '25%',
  },
  inputLabel: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'Nunito',
  },
  flexView: {
    display: 'flex',
    flex: 1,
  },
  text12: {
    fontSize: 12,
    fontFamily: 'Nunito',
  },
});

export const InputLabelGroup = ({
  label,
  value,
  minWidth = 25,
}: {
  label: string;
  value: string;
  minWidth?: number;
}) => (
  <View style={styles.labelInputGroupView}>
    <View style={[styles.inputLabelView, { width: `${minWidth}%` }]}>
      <Text style={styles.inputLabel}>{label}</Text>
    </View>
    <View style={[styles.inputView]}>
      <Text style={styles.text12}>{value}</Text>
    </View>
  </View>
);

export const ValueLabelGroup = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View style={{ display: 'flex', flexDirection: 'row' }}>
    <Text style={styles.inputLabel}>{label}</Text>
    <Text style={[styles.text12, { marginLeft: 8 }]}>{value}</Text>
  </View>
);

export const TabLookLike = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => (
  <View style={styles.tabLook}>
    <View style={commonStyles.flexRow}>
      <Text style={styles.tabLookHeaderText}>{title}</Text>
    </View>
    <View style={styles.tabLookBody}>{children}</View>
  </View>
);

export const Assigness = ({
  assignees,
  jobState,
}: {
  assignees: User[];
  jobState: string;
}) => {
  let rows = [];
  if (jobState === JobState.UNASSIGNED) {
    for (let i = 0; i < 8; i++) {
      rows.push(
        <View style={styles.assigneRow} key={`assignes_${i}`}>
          <View style={styles.assigneInput} />

          <View style={[styles.assigneInput, { margin: '0px 8px' }]} />

          <View style={styles.assigneInput} />
        </View>,
      );
    }
  } else {
    rows = assignees.map(({ firstName, lastName, employeeId }) => (
      <View style={styles.assigneRow} key={`assignes_${employeeId}`}>
        <View style={styles.assigneInput}>
          <Text style={styles.text12}>{firstName}</Text>
        </View>
        <View style={[styles.assigneInput, { margin: '0px 8px' }]}>
          <Text style={styles.text12}>{lastName}</Text>
        </View>
        <View style={styles.assigneInput}>
          <Text style={styles.text12}>{employeeId}</Text>
        </View>
      </View>
    ));
  }

  return (
    <View
      style={[
        styles.labelInputGroupView,
        { alignItems: 'flex-start', marginTop: 8 },
      ]}
    >
      <View style={styles.inputLabelView}>
        <Text style={styles.inputLabel}>Asignees : </Text>
      </View>
      <View style={styles.assignView}>
        <View style={[styles.assigneRow, { marginTop: 0 }]}>
          <View style={styles.flexView}>
            <Text style={styles.assigneHeading}>First Name</Text>
          </View>
          <View style={[styles.flexView, { margin: '0px 8px' }]}>
            <Text style={styles.assigneHeading}>Last Name</Text>
          </View>
          <View style={styles.flexView}>
            <Text style={styles.assigneHeading}>Employee Id</Text>
          </View>
        </View>
        {rows}
      </View>
    </View>
  );
};
