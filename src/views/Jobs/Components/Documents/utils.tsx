import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { JobStateEnum } from '#views/Jobs/NewListView/types';
import { formatDateTime } from '#utils/timeUtils';
import { PdfJobDataType } from './CommonJobPDFDetails';

export const commonStyles = StyleSheet.create({
  flexView: {
    display: 'flex',
    flex: 1,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  text12: {
    fontSize: 12,
    fontFamily: 'Nunito',
  },
  inputLabel: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'Nunito',
    textTransform: 'capitalize',
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
});

const tabLookLikeStyles = StyleSheet.create({
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
    padding: '8px 10 8px 10px',
  },
});

export const TabLookLike = ({
  children,
  title,
  wrap = true,
}: {
  children: ReactNode;
  title: string;
  wrap?: boolean;
}) => (
  <View style={tabLookLikeStyles.tabLook} wrap={wrap}>
    <View style={commonStyles.flexRow}>
      <Text style={tabLookLikeStyles.tabLookHeaderText}>{title}</Text>
    </View>
    <View style={tabLookLikeStyles.tabLookBody}>{children}</View>
  </View>
);

export const inputLabelGroupStyles = StyleSheet.create({
  labelInputGroupView: {
    flexDirection: 'row',
    paddingVertical: 4,
    alignItems: 'center',
    width: '100%',
    margin: 'auto',
  },
  inputLabelView: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '25%',
  },
});

export const InlineInputLabelGroup = ({
  label,
  value,
  minWidth = 30,
}: {
  label: string;
  value: string;
  minWidth?: number;
}) => (
  <View style={inputLabelGroupStyles.labelInputGroupView}>
    <View style={[commonStyles.inputLabelView, { width: `${minWidth}%` }]}>
      <Text style={commonStyles.inputLabel}>{label}</Text>
    </View>
    <View style={commonStyles.inputView}>
      <Text style={commonStyles.text12}>{value}</Text>
    </View>
  </View>
);

export const InputLabelGroup = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View>
    <View>
      <Text style={commonStyles.inputLabel}>{label}:</Text>
    </View>
    <View style={commonStyles.inputView}>
      <Text style={commonStyles.text12}>{value}</Text>
    </View>
  </View>
);

const assigneStyles = StyleSheet.create({
  assigneWrapper: {
    flexDirection: 'row',
    paddingVertical: 4,
    alignItems: 'center',
    width: '100%',
    margin: 'auto',
  },
  assigneRow: {
    flexDirection: 'row',
    display: 'flex',
    marginTop: '4px',
  },
  assigneHeading: {
    fontSize: 10,
    fontFamily: 'Nunito',
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
});

export const Assigness = ({
  assignees,
  jobState,
  dateAndTimeStampFormat,
  minWidth = 30,
}: {
  assignees: PdfJobDataType['assignees'];
  jobState: string;
  dateAndTimeStampFormat: string;
  minWidth?: number;
}) => {
  let rows = [];
  if (jobState === JobStateEnum.UNASSIGNED) {
    for (let i = 0; i < 8; i++) {
      rows.push(
        <View style={assigneStyles.assigneRow} key={`assignes_${i}`}>
          <View style={assigneStyles.assigneInput} />
          <View style={[assigneStyles.assigneInput, { margin: '0px 8px' }]} />
          <View style={[assigneStyles.assigneInput, { margin: '0px 8px' }]} />
        </View>,
      );
    }
  } else {
    rows = assignees.map(
      ({ firstName, lastName, employeeId, recentSignOffAt }, index) => (
        <View style={assigneStyles.assigneRow} key={`assignes_${employeeId}`}>
          <View style={assigneStyles.assigneInput}>
            <Text style={commonStyles.text12}>{firstName}</Text>
          </View>
          <View style={[assigneStyles.assigneInput, { margin: '0px 8px' }]}>
            <Text style={commonStyles.text12}>{lastName}</Text>
          </View>
          <View style={[assigneStyles.assigneInput, { margin: '0px 8px' }]}>
            <Text style={commonStyles.text12}>{employeeId}</Text>
          </View>
        </View>
      ),
    );
  }

  return (
    <View
      style={[assigneStyles.assigneWrapper, { alignItems: 'flex-start' }]}
      wrap={false}
    >
      <View style={assigneStyles.assignView}>
        <View style={[assigneStyles.assigneRow]}>
          <View style={commonStyles.flexView}>
            <Text style={assigneStyles.assigneHeading}>First Name</Text>
          </View>
          <View style={[commonStyles.flexView, { margin: '0px 8px' }]}>
            <Text style={assigneStyles.assigneHeading}>Last Name</Text>
          </View>
          <View style={[commonStyles.flexView, { margin: '0px 8px' }]}>
            <Text style={assigneStyles.assigneHeading}>Employee Id</Text>
          </View>
        </View>
        {rows}
      </View>
    </View>
  );
};

export const ValueLabelGroup = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View style={{ display: 'flex', flexDirection: 'row' }}>
    <Text style={commonStyles.inputLabel}>{label}</Text>
    <Text style={[commonStyles.text12, { marginLeft: 8 }]}>{value}</Text>
  </View>
);
