import React, { FC, useEffect } from 'react';
import { groupBy } from 'lodash';
import moment from 'moment';
import cleenLogo from '#assets/images/cleen.png';
import { useTypedSelector } from '#store';
import { useDispatch } from 'react-redux';
import { LoadingDiv, styles } from './styles';
import {
  Page,
  Text,
  View,
  Document,
  PDFViewer,
  Image,
} from '@react-pdf/renderer';
import {
  JobActivity as JobActivityType,
  JobActivitySeverity,
} from '#Composer/JobActivity/types';
import { fetchJobActivities } from '#Composer/JobActivity/actions';
import { PrintJobActivityProps } from './types';
import { formatDateTime } from '#utils/timeUtils';

const now = moment().format('Do MMM, YYYY, hh:mm a');

const MyPrintJobActivity: FC<{ jobId: string }> = ({ jobId }) => {
  const { logs } = useTypedSelector((state) => state.composer.activity);
  const { profile } = useTypedSelector((state) => state.auth);
  const { filters } = useTypedSelector((state) => state.activityFilters);

  const dispatch = useDispatch();

  useEffect(() => {
    if (jobId) {
      let lowerThan = moment().endOf('day');
      let greaterThan = moment().startOf('day').subtract(7, 'days');
      if (filters && filters.date) {
        const { dateRange, startTime, endTime } = filters.date;
        greaterThan = moment(
          `${formatDateTime(dateRange[0], 'YYYY-MM-DD')} ${formatDateTime(
            startTime,
            'HH:mm',
          )}`,
        );
        lowerThan = moment(
          `${formatDateTime(dateRange[1], 'YYYY-MM-DD')} ${formatDateTime(
            endTime,
            'HH:mm',
          )}`,
        );
      }
      fetchLogs(greaterThan.unix(), lowerThan.unix(), 0);
    }
  }, []);

  const fetchLogs = (
    greaterThan: number,
    lowerThan: number,
    page = 0,
    size = 250000,
  ) => {
    const filters = JSON.stringify({
      op: 'AND',
      fields: [
        {
          field: 'triggeredAt',
          op: 'GOE',
          values: [greaterThan],
        },
        {
          field: 'triggeredAt',
          op: 'LOE',
          values: [lowerThan],
        },
      ],
    });
    dispatch(
      fetchJobActivities({
        jobId,
        params: { size, filters, sort: 'triggeredAt,desc', page },
      }),
    );
  };

  if (!logs || logs.length === 0 || !profile) return null;

  const grouped = groupBy(logs, 'triggeredOn');
  const data = [] as Record<string, string | JobActivityType[]>[];

  Object.keys(grouped).forEach((item) => {
    data.push({
      [`${item}`]: grouped[item],
      id: item,
    });
  });

  return (
    <PDFViewer style={{ width: '100%', height: '100%' }}>
      <Document>
        <Page style={styles.page}>
          <View style={styles.header} fixed>
            <Image src={cleenLogo} style={{ height: '24px' }} />
            <View
              style={[
                styles.flexRow,
                {
                  justifyContent: 'flex-end',
                },
              ]}
            ></View>
          </View>

          <View style={styles.mainHeader}>
            <View style={styles.clientLogoWrapper}>
              <Text
                style={[styles.text12, { color: '#FFF', fontWeight: 'bold' }]}
              >
                Client Logo
              </Text>
            </View>
            <Image src={cleenLogo} style={{ height: '24px' }} />
          </View>

          <View style={styles.container}>
            {data.map((item) => {
              const day = moment(Object.keys(item)[0]).format('MMM Do, YYYY');
              let criticalCount = 0;
              item[item.id].forEach((element: JobActivityType) => {
                if (element.severity === JobActivitySeverity.CRITICAL)
                  criticalCount++;
              });

              return (
                <View style={styles.columns} key={`name_${item.id}`}>
                  <View style={styles.logHeader}>
                    <Text style={styles.headerItemText}>{day}</Text>
                    <Text style={styles.headerItemText}>
                      {item[item.id].length} activities
                    </Text>
                    {criticalCount !== 0 && (
                      <>
                        {/* <Image src={reportProblem} style={{ height: 12 }} /> */}
                        <Text style={styles.headerItemText}>
                          {criticalCount} Critical
                        </Text>
                      </>
                    )}
                  </View>
                  <View style={styles.logRow}>
                    {item[item.id].map((log: JobActivityType) => (
                      <View style={styles.logItem} key={`${log.id}`}>
                        <View style={styles.circle} />
                        <View style={styles.content} wrap={false}>
                          <Text style={styles.contentItems}>
                            {moment.unix(log.triggeredAt).format('hh:mm A')}
                          </Text>
                          {log.severity === JobActivitySeverity.CRITICAL && (
                            // <Image src={reportProblem} style={{ height: 12 }} />
                            <View />
                          )}
                          <Text
                            style={[
                              styles.contentItems,
                              {
                                paddingRight: 100,
                              },
                            ]}
                            wrap={false}
                          >
                            {log.details}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>

          <View fixed style={styles.footer}>
            <Text style={styles.footerInfo}>
              Downloaded on {now}. By {profile.firstName} {profile.lastName} ID:{' '}
              {profile.employeeId} using CLEEN App
            </Text>
            <View style={styles.pageInfo}>
              <Text
                style={{ fontSize: 10, minHeight: 10 }}
                render={({ pageNumber, totalPages }) => `${pageNumber}`}
                fixed
              />
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

const MemoPrintJobActivity = React.memo(MyPrintJobActivity);

const PrintJobActivity: FC<PrintJobActivityProps> = ({ jobId }) => (
  <>
    <LoadingDiv>Loading...</LoadingDiv>
    {jobId && <MemoPrintJobActivity jobId={jobId} />}
  </>
);

export default PrintJobActivity;
