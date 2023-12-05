import {
  PdfFooter,
  PdfHeader,
  PdfText,
  auditLogStyles,
  commonPdfStyles,
} from '#components/documents';
import { InputTypes } from '#utils/globalTypes';
import { formatDateTime } from '#utils/timeUtils';
import { Document, PDFViewer, Page, View } from '@react-pdf/renderer';
import { getUnixTime } from 'date-fns';
import { groupBy } from 'lodash';
import React, { FC, useContext } from 'react';
import {
  SessionActivitySeverity,
  SessionActivity as SessionActivityType,
} from '../ListView/SessionActivity/types';
import { PrintContext } from '../../Jobs/PrintJob/PrintContext';

export const SessionActivityPdf: FC<any> = ({
  profile,
  settings,
  logs,
  selectedFacility,
  dateAndTimeStampFormat,
  dateFormat,
  timeFormat,
}) => {
  const context = useContext(PrintContext);
  const grouped = groupBy(logs, 'triggeredOn');
  const data: { [x: string]: SessionActivityType[] | string }[] = [];

  Object.keys(grouped).forEach((item) => {
    data.push({
      [`${item}`]: grouped[item],
      id: item,
    });
  });

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
          <View style={commonPdfStyles.container}>
            {data.map((item) => {
              const day = formatDateTime({
                value: getUnixTime(new Date(Object.keys(item)[0])),
                type: InputTypes.DATE,
                format: dateFormat,
              });
              let criticalCount = 0;
              const itemId = item.id as string;
              (item[itemId] as SessionActivityType[]).forEach((element) => {
                if (element.severity === SessionActivitySeverity.CRITICAL) criticalCount++;
              });
              return (
                <View style={auditLogStyles.section} key={`name_${itemId}`}>
                  <PdfText style={auditLogStyles.sectionHeader}>
                    {day} - {item[itemId].length} activities
                    {criticalCount !== 0 && ` - ${criticalCount} Critical`}
                  </PdfText>
                  <View style={auditLogStyles.sectionBody}>
                    {(item[itemId] as SessionActivityType[]).map((log) => (
                      <View style={auditLogStyles.logRow} wrap={false} key={`${log.id}`}>
                        <View style={auditLogStyles.circle} />
                        <PdfText style={auditLogStyles.logInfo}>
                          {formatDateTime({
                            value: log.triggeredAt,
                            type: InputTypes.TIME,
                            format: timeFormat,
                          })}
                        </PdfText>
                        {log.severity === SessionActivitySeverity.CRITICAL && <View />}
                        <PdfText style={{ ...auditLogStyles.logInfo, flex: 1 }}>
                          {log.details}
                        </PdfText>
                      </View>
                    ))}
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
