import React, { FC, useEffect } from 'react';
import { groupBy } from 'lodash';
import moment from 'moment';
import cleenLogo from '#assets/images/cleen.png';
import { useTypedSelector } from '#store';
import { fetchData } from '#JobComposer/actions';
import { Entity } from '#JobComposer/composer.types';
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
} from '#JobComposer/JobActivity/types';
import { Checklist, TaskExecution } from '#PrototypeComposer/checklist.types';
import { fetchJobActivities } from '#JobComposer/JobActivity/actions';
import { PrintJobActivityProps } from './types';
import {
  TabLookLike,
  InputLabelGroup,
  Assigness,
} from '../PrintJob/Components';
import { removeUnderscore } from '#utils/stringUtils';

const now = moment().format('Do MMM, YYYY, hh:mm a');

const MyPrintJobActivity: FC<{ jobId: string }> = ({ jobId }) => {
  const { data: composerData } = useTypedSelector((state) => state.composer);
  const { logs } = useTypedSelector((state) => state.composer.activity);
  const { profile, settings } = useTypedSelector((state) => state.auth);
  const { filters } = useTypedSelector((state) => state.activityFilters);

  const dispatch = useDispatch();

  useEffect(() => {
    if (jobId) {
      dispatch(fetchData({ id: jobId, entity: Entity.JOB }));
      fetchLogs();
    }
  }, []);

  const fetchLogs = (page = 0, size = 250) => {
    dispatch(
      fetchJobActivities({
        jobId,
        params: { size, filters, sort: 'triggeredAt,desc', page },
      }),
    );
  };

  if (!logs || logs.length === 0 || !profile || !composerData) return null;

  const { checklist, ...jobExtras } = (composerData as unknown) as Checklist;
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
            <Image src={settings?.logoUrl || ''} style={{ height: '24px' }} />
            <Image src={cleenLogo} style={{ height: '24px' }} />
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
              <View style={styles.flexRow}>
                <View style={styles.flexRow}>
                  <InputLabelGroup
                    label="Equipment ID :"
                    value={checklist?.properties['EQUIPMENT ID'] || ''}
                    minWidth={50}
                  />
                </View>
                <View style={styles.flexRow}>
                  <InputLabelGroup
                    label="Room ID :"
                    value={jobExtras?.properties['ROOM ID'] || ''}
                  />
                </View>
              </View>
              <View style={styles.flexRow}>
                <View style={styles.flexRow}>
                  <InputLabelGroup
                    label="Product Manufactured :"
                    value={
                      jobExtras?.properties
                        ? jobExtras?.properties['PRODUCT MANUFACTURED']
                        : ''
                    }
                    minWidth={50}
                  />
                </View>
                <View style={styles.flexRow}>
                  <InputLabelGroup
                    label="Batch No :"
                    value={jobExtras?.properties['BATCH NO']}
                  />
                </View>
              </View>
              <Assigness assignees={assignees} jobState={jobExtras.state} />
            </TabLookLike>

            <TabLookLike title="Stage and Task Details">
              <InputLabelGroup
                label="Total Stages :"
                value={checklist?.stages?.length.toString()}
              />
              <InputLabelGroup
                label="Total Tasks :"
                value={jobExtras.totalTasks}
              />
            </TabLookLike>
          </View>

          <View style={styles.container} break>
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
