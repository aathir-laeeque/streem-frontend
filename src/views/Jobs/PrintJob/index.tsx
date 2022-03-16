import logo from '#assets/images/logo.png';
import { fetchData } from '#JobComposer/actions';
import { Task } from '#JobComposer/checklist.types';
import { Entity } from '#JobComposer/composer.types';
import {
  Checklist,
  ChecklistProperty,
  TaskExecution,
} from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import {
  Document,
  Image,
  Page,
  PDFViewer,
  Text,
  View,
} from '@react-pdf/renderer';
import moment from 'moment';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  AssignedJobStates,
  CompletedJobStates,
  Job,
  JobStateType,
} from '../NewListView/types';
import {
  Assigness,
  InputLabelGroup,
  TabLookLike,
  ValueLabelGroup,
} from './Components';
import { LoadingDiv, styles } from './styles';
import TaskView from './Task';
import { PrintJobProps } from './types';

const now = moment().format('Do MMM, YYYY, hh:mm a');

const MyPrintJob: FC<{ jobId: string }> = ({ jobId }) => {
  const { data } = useTypedSelector((state) => state.composer);
  const { profile, settings } = useTypedSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (jobId) {
      dispatch(fetchData({ id: jobId, entity: Entity.JOB }));
    }
  }, []);

  if (!data || !profile) return null;

  const { checklist, ...jobExtras } = data as unknown as {
    checklist: Checklist;
    code: string;
    properties: ChecklistProperty[];
    state: JobStateType;
    totalTasks: number;
  };
  let assigneesObj: Record<string, any> = {};
  checklist.stages.forEach((stage) =>
    stage.tasks.forEach((task) => {
      task.taskExecution.assignees.forEach(
        (assignee) =>
          (assigneesObj = { ...assigneesObj, [assignee.id]: assignee }),
      );
    }),
  );

  const assignees: TaskExecution['assignees'][] = [];
  Object.keys(assigneesObj).forEach((key) => {
    assignees.push(assigneesObj[key]);
  });

  const getJobStatus = (state: Job['state']) => {
    const isJobBlocked = state === AssignedJobStates.BLOCKED;
    const isJobStarted = state === AssignedJobStates.IN_PROGRESS;
    const isJobCompleted = state === CompletedJobStates.COMPLETED;
    const isCompletedWithException =
      state === CompletedJobStates.COMPLETED_WITH_EXCEPTION;

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
            >
              <Text style={[styles.text12, { fontWeight: 'bold' }]}>
                Job ID : {jobExtras.code}
              </Text>
            </View>
          </View>

          <View style={styles.mainHeader}>
            <Image src={settings?.logoUrl || ''} style={{ height: '24px' }} />
            <Image src={logo} style={{ height: '24px' }} />
          </View>
          <View style={styles.container}>
            <TabLookLike title="Checklist Details">
              <View>
                <InputLabelGroup
                  label="Checklist ID :"
                  value={checklist?.code || ''}
                />
                <InputLabelGroup
                  label="Checklist Name :"
                  value={checklist?.name || ''}
                />
              </View>
            </TabLookLike>

            <TabLookLike title="Job Details">
              <View>
                <InputLabelGroup label="Job ID :" value={jobExtras.code} />
                <InputLabelGroup
                  label="State :"
                  value={getJobStatus(jobExtras.state)}
                />
                {jobExtras.properties &&
                  jobExtras?.properties.map((prop) => (
                    <InputLabelGroup
                      label={`${prop.name} :`}
                      value={prop.value}
                      key={prop.id}
                    />
                  ))}
              </View>

              <Assigness assignees={assignees} jobState={jobExtras.state} />
            </TabLookLike>

            <TabLookLike title="Stage and Task Details" wrap={false}>
              <View>
                <InputLabelGroup
                  label="Total Stages :"
                  value={checklist?.stages?.length.toString()}
                />
                <InputLabelGroup
                  label="Total Tasks :"
                  value={jobExtras.totalTasks}
                />
              </View>
            </TabLookLike>
          </View>

          {checklist?.stages?.map((stage, stageIndex: number) => {
            return (
              <View key={`${stage.id}`} break>
                <View style={styles.stageHeader}>
                  <ValueLabelGroup
                    label="Stage :"
                    value={`${stage.orderTree}`}
                  />
                  <Text style={{ marginVertical: 8 }}>{stage.name}</Text>
                  <ValueLabelGroup
                    label="Tasks :"
                    value={`${stage.tasks.length}`}
                  />
                </View>
                {(stage.tasks as unknown as Array<Task>).map(
                  (task, taskIndex: number) => (
                    <TaskView taskIndex={taskIndex} task={task} key={task.id} />
                  ),
                )}
              </View>
            );
          })}

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

const MemoMyPrintJob = React.memo(MyPrintJob);

const PrintJob: FC<PrintJobProps> = ({ jobId }) => (
  <>
    <LoadingDiv>Loading...</LoadingDiv>
    {jobId && <MemoMyPrintJob jobId={jobId} />}
  </>
);

export default PrintJob;
