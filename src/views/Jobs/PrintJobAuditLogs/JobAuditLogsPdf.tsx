import {
  PdfFooter,
  PdfHeader,
  PdfLabelGroup,
  PdfTab,
  PdfText,
  auditLogStyles,
  commonPdfStyles,
} from '#components/documents';
import { getUserName } from '#services/users/helpers';
import { JobAuditLogType } from '#types';
import { FilterField, FilterOperators, InputTypes } from '#utils/globalTypes';
import { formatDateTime } from '#utils/timeUtils';
import { Document, Page, View } from '@react-pdf/renderer';
import { getUnixTime } from 'date-fns';
import { groupBy } from 'lodash';
import React, { FC, useMemo } from 'react';
import { CommonJobPdfDetails } from '../Components/Documents/CommonJobPDFDetails';
import { PrintContext } from '../PrintJob/PrintContext';
import { useContext } from 'react';

export const JobAuditLogsPdf: FC<any> = ({ profile, settings, logs, jobDetails, filters }) => {
  const context = useContext(PrintContext);
  const { selectedFacility, dateAndTimeStampFormat, timeFormat, dateFormat } = context;

  const grouped: { [index: string]: JobAuditLogType[] } = groupBy(logs, 'triggeredOn');
  const data = Object.keys(grouped).map((item) => ({
    [`${item}`]: grouped[item],
    id: item,
  }));
  const _parsedAuditLogsFilter = JSON.parse(filters).fields || [];
  const _parsedAuditLogsNames = JSON.parse(filters).names;

  const getFilterLabel = (fieldValue: FilterField) => {
    if (fieldValue?.field === 'triggeredAt' && fieldValue?.op === 'GOE') {
      return 'Start Time';
    } else if (fieldValue?.field === 'triggeredAt' && fieldValue?.op === 'LOE') {
      return 'End Time';
    } else {
      return 'Users';
    }
  };

  const getFilterValue = (fieldValue: FilterField) => {
    if (fieldValue?.field === 'triggeredAt') {
      return (
        formatDateTime({ value: fieldValue.values[0] as string, format: dateAndTimeStampFormat }) ||
        'N/A'
      );
    } else {
      let filteredUsers: string[] = [];
      _parsedAuditLogsNames?.map((user: any) => {
        filteredUsers.push(getUserName({ user, withEmployeeId: true }));
      });
      return filteredUsers.join(', ') || 'N/A';
    }
  };

  const appliedFilters = useMemo(
    () =>
      _parsedAuditLogsFilter.reduce((acc: any[], field: FilterField) => {
        const filter = {
          label: getFilterLabel(field),
          value: getFilterValue(field),
        };
        if (field.field === 'triggeredAt' && field.op === FilterOperators.GOE) {
          acc.unshift(filter);
        }
        acc.push(filter);
        return acc;
      }, []) as any[],
    [_parsedAuditLogsFilter, _parsedAuditLogsNames],
  );

  return (
    <PrintContext.Provider
      value={{
        ...context,
        extra: {},
      }}
    >
      <Document>
        <Page style={commonPdfStyles.page}>
          <PdfHeader logoUrl={settings?.logoUrl} />
          <CommonJobPdfDetails
            jobPdfData={jobDetails}
            dateAndTimeStampFormat={dateAndTimeStampFormat}
            dateFormat={dateFormat}
          />
          <View style={commonPdfStyles.container} wrap={false}>
            <PdfTab title="Filters Applied">
              <View style={{ gap: 8 }}>
                {appliedFilters.map((filter: any) => (
                  <PdfLabelGroup label={filter.label} value={filter.value} />
                ))}
              </View>
            </PdfTab>
          </View>

          <View style={commonPdfStyles.container} break>
            {data.map((item) => {
              const day = formatDateTime({
                value: getUnixTime(new Date(Object.keys(item)[0])),
                format: dateFormat,
              });
              return (
                <View style={auditLogStyles.section} key={`name_${item.id}`}>
                  <PdfText style={auditLogStyles.sectionHeader}>
                    {day} - {item[item.id].length} activities
                  </PdfText>
                  <View style={auditLogStyles.sectionBody}>
                    {(item[item.id] as JobAuditLogType[]).map((log: JobAuditLogType) => {
                      const details = log?.details?.replace(
                        '{{{0}}}',
                        formatDateTime({
                          value: log?.parameters[0]?.value,
                          format:
                            log?.parameters[0]?.type === InputTypes.DATE
                              ? dateFormat
                              : log?.parameters[0]?.type === InputTypes.TIME
                              ? timeFormat
                              : dateAndTimeStampFormat,
                        }),
                      );
                      return (
                        <View style={auditLogStyles.logRow} wrap={false} key={`${log.id}`}>
                          <View style={auditLogStyles.circle} />
                          <PdfText style={auditLogStyles.logInfo}>
                            {formatDateTime({
                              value: log.triggeredAt,
                              format: timeFormat,
                            })}
                          </PdfText>
                          <PdfText style={{ ...auditLogStyles.logInfo, flex: 1 }}>
                            {details}
                          </PdfText>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>

          <PdfFooter
            profile={profile}
            selectedFacility={selectedFacility}
            dateAndTimeStampFormat={dateAndTimeStampFormat}
          />
        </Page>
      </Document>
    </PrintContext.Provider>
  );
};
