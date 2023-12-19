import { MandatoryParameter, Media } from '#PrototypeComposer/checklist.types';
import {
  PdfLabelGroup,
  PdfTab,
  PdfTable,
  PdfText,
  commonPdfStyles,
  tableStyles,
} from '#components/documents';
import { getUserName } from '#services/users/helpers';
import { Job, JobStates, PartialUser } from '#types';
import { getParameterContent } from '#utils/parameterUtils';
import { formatDateTime, formatDuration } from '#utils/timeUtils';
import { Link, View } from '@react-pdf/renderer';
import React, { useContext } from 'react';
import { PrintContext } from '../../PrintJob/PrintContext';
import { CompletedJobStates, JobStateType } from '#views/Jobs/ListView/types';

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
  jobAnnotationDto: any;
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
    jobAnnotationDto,
  } = jobPdfData;

  const {
    extra: { variationData },
  } = useContext(PrintContext);

  const getColumnData = (object, id) => {
    return object[id];
  };

  const getColumnNames = () => {
    return [
      { id: 'value', name: 'Parameter Name', value: 'parameterName' },
      { id: 'value', name: 'Variation Name', value: 'name' },
      { id: 'value', name: 'Variation Number', value: 'variationNumber' },
      { id: 'value', name: 'Location', value: 'location' },
      { id: 'value', name: 'Variation Type', value: 'type' },
      { id: 'value', name: 'Value Before', value: 'oldVariationString' },
      { id: 'value', name: 'Value After', value: 'newVariationString' },
    ];
  };

  const getColumnValues = () => {
    let arr: any = [];

    variationData?.map((object, index) => {
      arr.push({
        value: (data) => {
          return (
            <PdfText style={tableStyles.columnText}>{getColumnData(object, data.value)}</PdfText>
          );
        },
        id: index,
      });
    });

    return arr;
  };

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

  const getCompletedJobState = (state: JobStateType) => {
    const isJobCompleted = state === CompletedJobStates.COMPLETED;
    const isCompletedWithException = state === CompletedJobStates.COMPLETED_WITH_EXCEPTION;

    if (isJobCompleted || isCompletedWithException) {
      return true;
    }
    return false;
  };

  const getMediaDetails = (medias) => {
    let string = '';
    medias.forEach((media: Media) => (string = string + media.originalFilename + '\n'));
    return string;
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
              // parameter response is an array of responses and in case of CJF there will always be only one response.
              if (currParam?.response?.[0]?.hidden) return null;
              const cjfParameter = { ...currParam, response: currParam?.response?.[0] };
              return (
                <PdfLabelGroup
                  key={currParam.id}
                  label={currParam.label}
                  value={getParameterContent(
                    cjfParameter,
                    currParam.type === MandatoryParameter.DATE
                      ? dateFormat
                      : dateAndTimeStampFormat,
                  )}
                />
              );
            })}
        </View>
      </PdfTab>

      {getCompletedJobState(jobState) && jobAnnotationDto && (
        <PdfTab title="Annotation">
          <View style={{ gap: 8 }}>
            <PdfLabelGroup label="Remarks" value={jobAnnotationDto.remarks} />
            {jobAnnotationDto?.medias && (
              <PdfLabelGroup
                label="Medias"
                value={jobAnnotationDto.medias.map((el) => (
                  <Link src={el.link} style={commonPdfStyles.link}>
                    {el.originalFilename}
                    {'\n'}
                  </Link>
                ))}
              />
            )}
          </View>
        </PdfTab>
      )}

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
      {variationData && Object.keys(variationData)?.length > 0 && (
        <View>
          <PdfText style={tableStyles.headerText}>Variation Data :</PdfText>
          <PdfTable columns={getColumnNames()} data={getColumnValues()} />
        </View>
      )}
    </View>
  );
};
