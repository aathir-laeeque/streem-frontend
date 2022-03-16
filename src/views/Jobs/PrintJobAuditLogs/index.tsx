import logo from '#assets/images/logo.png';
import { fetchData } from '#JobComposer/actions';
import { Entity } from '#JobComposer/composer.types';
import { fetchJobAuditLogs } from '#JobComposer/JobAuditLogs/actions';
import { JobAuditLogType } from '#JobComposer/JobAuditLogs/types';
import { Checklist, TaskExecution } from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import { removeUnderscore } from '#utils/stringUtils';
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
import {
  Assigness,
  InputLabelGroup,
  TabLookLike,
} from '../PrintJob/Components';
import { LoadingDiv, styles } from './styles';
import { PrintJobAuditLogProps } from './types';

const now = moment().format('Do MMM, YYYY, hh:mm a');

const MyPrintJobAuditLogs: FC<{ jobId: string }> = ({ jobId }) => {
  const { data: composerData } = useTypedSelector((state) => state.composer);
  const { logs } = useTypedSelector((state) => state.composer.auditLogs);
  const { profile, settings } = useTypedSelector((state) => state.auth);
  const { filters } = useTypedSelector((state) => state.auditLogFilters);
  const dispatch = useDispatch();

  useEffect(() => {
    if (jobId) {
      dispatch(fetchData({ id: jobId, entity: Entity.JOB }));
      fetchLogs();
    }
  }, []);

  const fetchLogs = (page = 0, size = 250) => {
    dispatch(
      fetchJobAuditLogs({
        jobId,
        params: { size, filters, sort: 'triggeredAt,desc', page },
      }),
    );
  };

  if (!logs || logs.length === 0 || !profile || !composerData) return null;

  const { checklist, ...jobExtras } = composerData;
  let assigneesObj: Record<string, any> = {};
  (checklist as Checklist).stages.forEach((stage) =>
    stage.tasks.forEach((task) =>
      task.taskExecution.assignees.forEach(
        (assignee) =>
          (assigneesObj = { ...assigneesObj, [assignee.id]: assignee }),
      ),
    ),
  );

  const assignees: TaskExecution['assignees'][] = [];
  Object.keys(assigneesObj).forEach((key) => {
    assignees.push(assigneesObj[key]);
  });

  const grouped: { [index: string]: JobAuditLogType[] } = groupBy(
    logs,
    'triggeredOn',
  );
  const data = Object.keys(grouped).map((item) => ({
    auditLogs: grouped[item],
    id: item,
  }));

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
            <TabLookLike title="Checklist Details">
              <InputLabelGroup
                label="Checklist ID :"
                value={checklist?.code || ''}
              />
              <InputLabelGroup
                label="Checklist Name :"
                value={checklist?.name || ''}
              />
            </TabLookLike>

            <TabLookLike title="Job Details">
              <InputLabelGroup label="Job ID :" value={jobExtras.code} />
              <InputLabelGroup
                label="State :"
                value={removeUnderscore(jobExtras.state)}
              />
              {jobExtras?.properties &&
                jobExtras.properties.map((props: any) => {
                  return (
                    <View style={styles.flexRow}>
                      <InputLabelGroup
                        label={props.label}
                        value={props.value}
                        key={props.id}
                      />
                    </View>
                  );
                })}
              <Assigness assignees={assignees} jobState={jobExtras.state} />
            </TabLookLike>

            <TabLookLike title="Stage and Task Details">
              <InputLabelGroup
                label="Total Stages :"
                value={checklist?.stages?.length.toString()}
              />
              <InputLabelGroup
                label="Total Tasks :"
                value={jobExtras.totalTasks.toString()}
              />
            </TabLookLike>
          </View>

          <View style={styles.container} break>
            {data.map((item) => {
              const day = moment(Object.keys(item)[0]).format('MMM Do, YYYY');

              return (
                <View style={styles.columns} key={`name_${item.id}`}>
                  <View style={styles.logHeader}>
                    <Text style={styles.headerItemText}>{day}</Text>
                    <Text style={styles.headerItemText}>
                      {item.auditLogs.length} activities
                    </Text>
                  </View>
                  <View style={styles.logRow}>
                    {item.auditLogs.map((log: JobAuditLogType) => (
                      <View style={styles.logItem} key={`${log.id}`}>
                        <View style={styles.circle} />
                        <View style={styles.content} wrap={false}>
                          <Text style={styles.contentItems}>
                            {moment.unix(log.triggeredAt).format('hh:mm A')}
                          </Text>
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
                render={({ pageNumber }) => `${pageNumber}`}
                fixed
              />
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

const MemoPrintJobAuditLogs = React.memo(MyPrintJobAuditLogs);

const PrintJobAuditLogs: FC<PrintJobAuditLogProps> = ({ jobId }) => (
  <>
    <LoadingDiv>Loading...</LoadingDiv>
    {jobId && <MemoPrintJobAuditLogs jobId={jobId} />}
  </>
);

export default PrintJobAuditLogs;
