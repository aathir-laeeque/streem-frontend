import {
  PdfFooter,
  PdfHeader,
  PdfText,
  auditLogStyles,
  commonPdfStyles,
} from '#components/documents';
import { useTypedSelector } from '#store';
import { setKeepPersistedData } from '#utils';
import { DEFAULT_PAGE_NUMBER } from '#utils/constants';
import { InputTypes } from '#utils/globalTypes';
import { formatDateTime } from '#utils/timeUtils';
import { Document, PDFViewer, Page, View } from '@react-pdf/renderer';
import { getUnixTime } from 'date-fns';
import { groupBy } from 'lodash';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSessionActivities } from '../ListView/SessionActivity/actions';
import {
  SessionActivitySeverity,
  SessionActivity as SessionActivityType,
} from '../ListView/SessionActivity/types';
import { LoadingDiv } from './styles';

const MyPrintSessionActivity: FC = () => {
  const { logs } = useTypedSelector((state) => state.sessionActivity);
  const { facilityWiseConstants } = useTypedSelector((state) => state);
  const { profile, settings, selectedFacility } = useTypedSelector((state) => state.auth);
  const { filters } = useTypedSelector((state) => state.auditLogFilters);
  const { dateAndTimeStampFormat } = facilityWiseConstants[selectedFacility!.id];

  const dispatch = useDispatch();

  useEffect(() => {
    setKeepPersistedData();
    fetchLogs();
  }, []);

  const fetchLogs = (page = DEFAULT_PAGE_NUMBER, size = 250) => {
    dispatch(fetchSessionActivities({ size, filters, sort: 'triggeredAt,desc', page }));
  };

  if (!logs || logs.length === 0 || !profile) return null;

  const grouped = groupBy(logs, 'triggeredOn');
  const data: { [x: string]: SessionActivityType[] | string }[] = [];

  Object.keys(grouped).forEach((item) => {
    data.push({
      [`${item}`]: grouped[item],
      id: item,
    });
  });

  return (
    <PDFViewer style={{ width: '100%', height: '100%' }}>
      <Document>
        <Page style={commonPdfStyles.page}>
          <PdfHeader logoUrl={settings?.logoUrl} />
          <View style={commonPdfStyles.container}>
            {data.map((item) => {
              const day = formatDateTime({
                value: getUnixTime(new Date(Object.keys(item)[0])),
                type: InputTypes.DATE,
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
                          {formatDateTime({ value: log.triggeredAt, type: InputTypes.TIME })}
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
    </PDFViewer>
  );
};

const MemoPrintSessionActivity = React.memo(MyPrintSessionActivity);

const PrintSessionActivity: FC = () => (
  <>
    <LoadingDiv>Loading...</LoadingDiv>
    <MemoPrintSessionActivity />
  </>
);

export default PrintSessionActivity;
