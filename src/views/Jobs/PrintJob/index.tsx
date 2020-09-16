import { useTypedSelector } from '#store';
import { Task } from '#Composer/checklist.types';
import TaskView from './Task';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PrintJobProps } from './types';
import { fetchData } from '#Composer/actions';
import cleenLogo from '#assets/images/cleen.png';
import {
  Page,
  Text,
  View,
  Document,
  PDFViewer,
  Image,
} from '@react-pdf/renderer';
import moment from 'moment';
import {
  Assigness,
  TabLookLike,
  ValueLabelGroup,
  InputLabelGroup,
} from './Components';
import { styles, LoadingDiv } from './styles';
import { Entity } from '#Composer/composer.types';

const now = moment().format('Do MMM, YYYY, HH:MM a');

const MyPrintJob: FC<{ jobId: string }> = ({ jobId }) => {
  const { data } = useTypedSelector((state) => state.composer);
  const { profile } = useTypedSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (jobId) {
      dispatch(fetchData({ id: parseInt(jobId, 10), entity: Entity.JOB }));
    }
  }, []);

  if (!data || !profile) return null;

  const { checklist, ...jobExtras } = data;

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
            >
              <Text style={[styles.text12, { fontWeight: 'bold' }]}>
                Job ID : {jobExtras.code}
              </Text>
            </View>
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
              <InputLabelGroup label="Status :" value={jobExtras.status} />
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
                    value={jobExtras?.properties['PRODUCT MANUFACTURED'] || ''}
                    minWidth={50}
                  />
                </View>
                <View style={styles.flexRow}>
                  <InputLabelGroup
                    label="Batch No :"
                    value={jobExtras.properties['BATCH NO']}
                  />
                </View>
              </View>
              <Assigness
                assignees={jobExtras.assignees}
                jobStatus={jobExtras.status}
              />
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

          {checklist?.stages?.map((stage, stageIndex: number) => {
            return (
              <View key={`${stage.id}`} break>
                <View style={styles.stageHeader}>
                  <ValueLabelGroup
                    label="Stage :"
                    value={`${stageIndex + 1}`}
                  />
                  <Text style={{ marginVertical: 8 }}>{stage.name}</Text>
                  <ValueLabelGroup
                    label="Tasks :"
                    value={`${stage.tasks.length}`}
                  />
                </View>
                {(stage.tasks as Array<Task>).map((task, taskIndex: number) => (
                  <TaskView taskIndex={taskIndex} task={task} key={task.id} />
                ))}
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
