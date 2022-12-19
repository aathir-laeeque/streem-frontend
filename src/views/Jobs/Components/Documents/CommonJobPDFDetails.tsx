import { Checklist } from '#PrototypeComposer/checklist.types';
import { User } from '#store/users/types';
import { formatDateTime, formatDuration1 } from '#utils/timeUtils';
import { JobSummary } from '#views/Jobs/Summary/types';
import { Link, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import {
  AssignedJobStates,
  CompletedJobStates,
  JobRelation,
  JobStateType,
} from '../../ListView/types';
import {
  Assigness,
  commonStyles,
  InlineInputLabelGroup,
  InputLabelGroup,
  TabLookLike,
} from './utils';

export type PdfJobDataType = Pick<
  JobSummary,
  | 'id'
  | 'code'
  | 'createdAt'
  | 'createdBy'
  | 'startedAt'
  | 'endedAt'
  | 'properties'
  | 'totalDuration'
  | 'state'
  | 'cweDetails'
> & {
  assignees: (Pick<User, 'email' | 'id' | 'employeeId' | 'firstName' | 'lastName'> & {
    recentSignOffAt: number;
  })[];
  endedBy: Pick<User, 'id' | 'employeeId' | 'firstName' | 'lastName' | 'archived'> | null;
  totalStages: number;
  totalTask: number;
  checklist: Checklist;
  relations: JobRelation[];
  parameterValues: [];
};

const jobDataStyles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },

  card: {
    borderColor: '#000',
    borderRadius: 4,
    borderWidth: 1,
    display: 'flex',
    flex: 1,
    marginRight: 8,
    backgroundColor: '#fff',
  },

  cardHeader: {
    backgroundColor: '#000',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    padding: 4,
    textAlign: 'left',
  },

  cardBody: {
    color: '#000',
    fontSize: 12,
    fontWeight: 600,
    padding: 8,
    textAlign: 'left',
  },

  lastChild: {
    marginRight: 0,
  },
});

export const CommonJobPdfDetails = ({
  jobPdfData,
  dateAndTimeStampFormat,
}: {
  jobPdfData: PdfJobDataType;
  dateAndTimeStampFormat: string;
}) => {
  const {
    checklist,
    code,
    state: jobState,
    assignees,
    totalTask,
    startedAt,
    createdBy,
    endedAt,
    endedBy,
    totalDuration,
    cweDetails,
    totalStages,
    relations,
    parameterValues,
  } = jobPdfData;

  const getJobStatus = (state: JobStateType) => {
    const isJobBlocked = state === AssignedJobStates.BLOCKED;
    const isJobStarted = state === AssignedJobStates.IN_PROGRESS;
    const isJobCompleted = state === CompletedJobStates.COMPLETED;
    const isCompletedWithException = state === CompletedJobStates.COMPLETED_WITH_EXCEPTION;

    let status = '';

    isJobCompleted
      ? (status = 'Completed')
      : isCompletedWithException
      ? (status = 'Completed with Exception')
      : isJobBlocked
      ? (status = 'Approval Pending')
      : isJobStarted
      ? (status = 'Started')
      : (status = 'Not Started');

    return status;
  };

  const getParameterValue = (parameter) => {
    if (parameter.response.value) {
      return parameter.response.value;
    } else if (parameter.response.choices && Array.isArray(parameter.response.choices)) {
      return parameter.response.choices.map((currChoice) => currChoice.objectDisplayName);
    } else if (parameter.response.choices && !Array.isArray(parameter.response.choices)) {
      return choicesValue(parameter);
    }
  };

  const choicesValue = (parameter) => {
    let selectedKeys = [];
    for (let keys in parameter.response.choices) {
      if (parameter.response.choices[keys] === 'SELECTED') {
        selectedKeys.push(keys);
      }
    }

    const valuesArray = parameter.data.reduce((acc: [], currData) => {
      selectedKeys.includes(currData.id) ? acc.push(currData.name) : acc;
      return acc;
    }, []);

    return valuesArray.join(', ');
  };

  return (
    <View style={{ paddingHorizontal: 40, paddingVertical: 8 }}>
      <TabLookLike title="Job Summary">
        <View style={jobDataStyles.row}>
          <View style={jobDataStyles.card}>
            <Text style={jobDataStyles.cardHeader}>Job Started On</Text>

            <Text style={jobDataStyles.cardBody}>
              {startedAt ? formatDateTime(startedAt, dateAndTimeStampFormat) : 'N/A'}
            </Text>
          </View>

          <View style={jobDataStyles.card}>
            <Text style={jobDataStyles.cardHeader}>Job Completed On</Text>

            <Text style={jobDataStyles.cardBody}>
              {endedAt ? formatDateTime(endedAt, dateAndTimeStampFormat) : 'N/A'}
            </Text>
          </View>

          <View style={jobDataStyles.card}>
            <Text style={jobDataStyles.cardHeader}>Job Duration</Text>

            <Text style={jobDataStyles.cardBody}>
              {totalDuration ? formatDuration1({ duration: totalDuration }) : 'N/A'}
            </Text>
          </View>
        </View>
      </TabLookLike>

      {checklist && (
        <TabLookLike title="Checklist Details">
          <View>
            <InlineInputLabelGroup label="Checklist ID:" value={checklist.code} />
            <InlineInputLabelGroup label="Name:" value={checklist.name} />
            {checklist.properties?.map((property) => (
              <InlineInputLabelGroup
                label={`${property.label}:`}
                value={property.value || '-'}
                key={property.id}
              />
            ))}
          </View>
        </TabLookLike>
      )}

      <TabLookLike title="Job Details">
        <View>
          <InlineInputLabelGroup label="Job ID:" value={code} />
          <InlineInputLabelGroup label="State:" value={getJobStatus(jobState)} />
          <InlineInputLabelGroup
            label="Job Created By:"
            value={
              createdBy
                ? `${createdBy.firstName} ${createdBy.lastName} ID:${createdBy.employeeId}`
                : '-'
            }
          />
          <InlineInputLabelGroup
            label="Job Completed By:"
            value={
              endedBy ? `${endedBy.firstName} ${endedBy.lastName} ID:${endedBy.employeeId}` : '-'
            }
          />
          {parameterValues.map((currParam) => (
            <InlineInputLabelGroup label={currParam.label} value={getParameterValue(currParam)} />
          ))}

          {relations &&
            relations.map((relation) => {
              return (
                <InlineInputLabelGroup
                  label={`${relation.displayName}:`}
                  value={relation.targets
                    .map((target) => `${target.displayName} - ${target.externalId}`)
                    .join('\n')}
                  key={relation.id}
                />
              );
            })}
        </View>
      </TabLookLike>

      {cweDetails && (
        <TabLookLike title="Job Completed with Exception">
          <InputLabelGroup label={'Reason for Exception:'} value={cweDetails.reason} />
          <View style={{ marginTop: '8px' }}>
            <InputLabelGroup label={'Additional Comments:'} value={cweDetails.comment} />
          </View>
          {cweDetails.medias?.length ? (
            <View style={{ marginTop: '8px' }}>
              <View>
                <Text style={commonStyles.inputLabel}>Link to Attached Document :</Text>
              </View>
              <View style={commonStyles.inputView}>
                {cweDetails.medias.map((media, index) => (
                  <View
                    style={{
                      ...(index !== 0 ? { marginTop: '10px' } : {}),
                    }}
                  >
                    <Link
                      key={media.id}
                      src={media.link}
                      style={{
                        color: '#333',
                        fontSize: 12,
                        fontWeight: 600,
                        textAlign: 'left',
                      }}
                    >
                      {media.link}
                    </Link>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </TabLookLike>
      )}

      <TabLookLike title="Assignees">
        <Assigness
          assignees={assignees}
          jobState={jobState}
          dateAndTimeStampFormat={dateAndTimeStampFormat}
        />
      </TabLookLike>

      <TabLookLike title="Stage and Task Details">
        <View>
          <InputLabelGroup label="Total Stages" value={totalStages.toString()} />
          <View style={{ marginTop: '8px' }}>
            <InputLabelGroup label="Total Tasks" value={totalTask.toString()} />
          </View>
        </View>
      </TabLookLike>
    </View>
  );
};
