import logo from '#assets/images/logo.png';
import { useTypedSelector } from '#store';
import {
  Document,
  Image,
  Page,
  PDFViewer,
  Text,
  View,
} from '@react-pdf/renderer';
import { groupBy } from 'lodash';
import moment from 'moment';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchSessionActivities } from '../ListView/SessionActivity/actions';
import {
  SessionActivity as SessionActivityType,
  SessionActivitySeverity,
} from '../ListView/SessionActivity/types';
import { LoadingDiv, styles } from './styles';

const now = moment().format('Do MMM, YYYY, hh:mm a');

const MyPrintSessionActivity: FC = () => {
  const { logs } = useTypedSelector((state) => state.sessionActivity);
  const { profile, settings } = useTypedSelector((state) => state.auth);
  const { filters } = useTypedSelector((state) => state.activityFilters);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = (page = 0, size = 250) => {
    dispatch(
      fetchSessionActivities({ size, filters, sort: 'triggeredAt,desc', page }),
    );
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
        <Page style={styles.page}>
          <View style={styles.header} fixed>
            <Image src={logo} style={{ height: '24px' }} />
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
            <Image src={settings?.logoUrl || ''} style={{ height: '24px' }} />
            <Image src={logo} style={{ height: '24px' }} />
          </View>

          <View style={styles.container}>
            {data.map((item) => {
              const day = moment(Object.keys(item)[0]).format('MMM Do, YYYY');
              let criticalCount = 0;
              const itemId = item.id as string;
              (item[itemId] as SessionActivityType[]).forEach((element) => {
                if (element.severity === SessionActivitySeverity.CRITICAL)
                  criticalCount++;
              });

              return (
                <View style={styles.columns} key={`name_${item.id}`}>
                  <View style={styles.logHeader}>
                    <Text style={styles.headerItemText}>{day}</Text>
                    <Text style={styles.headerItemText}>
                      {item[itemId].length} activities
                    </Text>
                    {criticalCount !== 0 && (
                      <>
                        <Text style={styles.headerItemText}>
                          {criticalCount} Critical
                        </Text>
                      </>
                    )}
                  </View>
                  <View style={styles.logRow}>
                    {(item[itemId] as SessionActivityType[]).map((log) => (
                      <View style={styles.logItem} key={`${log.id}`}>
                        <View style={styles.circle} />
                        <View style={styles.content} wrap={false}>
                          <Text style={styles.contentItems}>
                            {moment.unix(log.triggeredAt).format('hh:mm A')}
                          </Text>
                          {log.severity ===
                            SessionActivitySeverity.CRITICAL && <View />}
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

const MemoPrintSessionActivity = React.memo(MyPrintSessionActivity);

const PrintSessionActivity: FC = () => (
  <>
    <LoadingDiv>Loading...</LoadingDiv>
    <MemoPrintSessionActivity />
  </>
);

export default PrintSessionActivity;
