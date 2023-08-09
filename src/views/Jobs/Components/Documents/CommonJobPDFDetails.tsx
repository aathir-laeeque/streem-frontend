import { MandatoryParameter, Media } from '#PrototypeComposer/checklist.types';
import { PdfLabelGroup, PdfTab, PdfText, commonPdfStyles } from '#components/documents';
import { getUserName } from '#services/users/helpers';
import { Job, JobStates, PartialUser } from '#types';
import { getParameterContent } from '#utils/parameterUtils';
import { formatDateTime, formatDuration } from '#utils/timeUtils';
import { Link, View } from '@react-pdf/renderer';
import React from 'react';

export type PdfJobDataType = Job & {
  createdAt: number;
  createdBy: PartialUser;
  totalDuration: number | null;
  cweDetails: null | {
    comment: string;
    medias: Media[];
    reason: string;
  };
  endedBy: PartialUser | null;
  totalStages: number;
  totalTask: number;
};

export const CommonJobPdfDetails = ({
  jobPdfData,
  dateAndTimeStampFormat,
  dateFormat,
}: {
  jobPdfData: PdfJobDataType;
  dateAndTimeStampFormat: string;
  dateFormat: string;
}) => {
  const {
    checklist,
    code,
    state: jobState,
    totalTask,
    startedAt,
    scheduler,
    createdBy,
    endedAt,
    endedBy,
    totalDuration,
    cweDetails,
    totalStages,
    parameterValues,
  } = jobPdfData;

  const getJobStatus = (state: JobStates) => {
    const isJobBlocked = state === 'BLOCKED';
    const isJobStarted = state === 'IN_PROGRESS';
    const isJobCompleted = state === 'COMPLETED';
    const isCompletedWithException = state === 'COMPLETED_WITH_EXCEPTION';

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

  return (
    <View style={commonPdfStyles.container}>
      <View style={commonPdfStyles.flexGrid}>
        <View style={commonPdfStyles.card}>
          <PdfText style={commonPdfStyles.cardHeader}>Job Started On</PdfText>
          <PdfText style={commonPdfStyles.cardBody}>
            {startedAt
              ? formatDateTime({ value: startedAt, format: dateAndTimeStampFormat })
              : 'N/A'}
          </PdfText>
        </View>

        <View style={commonPdfStyles.card}>
          <PdfText style={commonPdfStyles.cardHeader}>Job Completed On</PdfText>

          <PdfText style={commonPdfStyles.cardBody}>
            {endedAt ? formatDateTime({ value: endedAt, format: dateAndTimeStampFormat }) : 'N/A'}
          </PdfText>
        </View>

        <View style={commonPdfStyles.card}>
          <PdfText style={commonPdfStyles.cardHeader}>Job Duration</PdfText>

          <PdfText style={commonPdfStyles.cardBody}>
            {totalDuration ? formatDuration(totalDuration) : 'N/A'}
          </PdfText>
        </View>
      </View>

      {checklist && (
        <PdfTab title="Process Details">
          <View style={{ gap: 8 }}>
            <PdfLabelGroup label="Process ID" value={checklist.code} />
            <PdfLabelGroup label="Name" value={checklist.name} />
            {checklist.properties?.map((property) => (
              <PdfLabelGroup
                label={property.label}
                value={property.value || '-'}
                key={property.id}
              />
            ))}
          </View>
        </PdfTab>
      )}

      <PdfTab title="Job Details">
        <View style={{ gap: 8 }}>
          <PdfLabelGroup label="Job ID" value={code} />
          <PdfLabelGroup label="State" value={getJobStatus(jobState)} />
          <PdfLabelGroup
            label="Job Created By"
            value={
              scheduler?.name
                ? `Job created automatically as per Schedule: ${scheduler.name} (ID:${scheduler.code})`
                : createdBy
                ? getUserName({ user: createdBy, withEmployeeId: true })
                : '-'
            }
          />
          <PdfLabelGroup
            label="Job Completed By"
            value={endedBy ? getUserName({ user: endedBy, withEmployeeId: true }) : '-'}
          />
          {parameterValues
            .sort((a, b) => a?.orderTree - b?.orderTree)
            .map((currParam) => {
              if (currParam.response?.hidden) return null;

              return (
                <PdfLabelGroup
                  key={currParam.id}
                  label={currParam.label}
                  value={getParameterContent(
                    currParam,
                    currParam.type === MandatoryParameter.DATE
                      ? dateFormat
                      : dateAndTimeStampFormat,
                  )}
                />
              );
            })}
        </View>
      </PdfTab>

      {cweDetails && (
        <PdfTab title="Job Completed with Exception">
          <View style={{ gap: 8 }}>
            <PdfLabelGroup label="Reason for Exception" value={cweDetails.reason} />
            <PdfLabelGroup label="Additional Comments" value={cweDetails.comment} />
            {cweDetails.medias?.length > 0 && (
              <PdfLabelGroup
                label="Link to Attached Document"
                inline={false}
                value={cweDetails.medias.map((media) => (
                  <Link key={media.id} src={media.link} style={commonPdfStyles.link}>
                    {media.originalFilename || media.filename}
                  </Link>
                ))}
              />
            )}
          </View>
        </PdfTab>
      )}

      <PdfTab title="Stage and Task Details">
        <View style={{ gap: 8 }}>
          <PdfLabelGroup label="Total Stages" value={totalStages.toString()} />
          <PdfLabelGroup label="Total Tasks" value={totalTask.toString()} />
        </View>
      </PdfTab>
    </View>
  );
};
