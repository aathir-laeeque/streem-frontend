import logo from '#assets/images/logo.png';
import { ActivitiesById, ActivitiesOrderInTaskInStage } from '#JobComposer/ActivityList/types';
import { Checklist, Task } from '#JobComposer/checklist.types';
import { getActivities } from '#JobComposer/utils';
import { useTypedSelector } from '#store';
import { setKeepPersistedData } from '#utils';
import { apiPrintJobDetails } from '#utils/apiUrls';
import { request } from '#utils/request';
import { Document, Image, Page, PDFViewer, Text, View } from '@react-pdf/renderer';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { CommonJobPdfDetails, PdfJobDataType } from '../Components/Documents/CommonJobPDFDetails';
import { ValueLabelGroup } from '../Components/Documents/utils';
import { LoadingDiv, styles } from './styles';
import TaskView from './Task';
import { PrintJobProps } from './types';

const MyPrintJob: FC<{ jobId: string }> = ({ jobId }) => {
  const [data, setData] = useState<PdfJobDataType | undefined>();
  const [activitiesData, setActivitiesData] = useState<{
    activitiesById: ActivitiesById;
    activitiesOrderInTaskInStage: ActivitiesOrderInTaskInStage;
  }>({
    activitiesById: {},
    activitiesOrderInTaskInStage: {},
  });
  const { activitiesById } = activitiesData;
  const { profile, settings, selectedFacility } = useTypedSelector((state) => state.auth);

  const { dateAndTimeStampFormat, timeFormat, dateFormat } = useTypedSelector(
    (state) => state.facilityWiseConstants[selectedFacility!.id],
  );

  useEffect(() => {
    setKeepPersistedData();
    const fetchJobPdfData = async () => {
      try {
        const response: { data: PdfJobDataType } = await request('GET', apiPrintJobDetails(jobId));
        setActivitiesData(
          getActivities({ checklist: response.data.checklist as unknown as Checklist }),
        );
        setData(response.data);
      } catch (err) {
        console.error('error from fetch job PDF data api ==>', err);
      }
    };

    if (jobId) {
      fetchJobPdfData();
    }
  }, []);

  if (!data || !profile || !Object.keys(activitiesById).length) return null;

  const { checklist, code } = data;

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
              <Text style={[styles.text12, { fontWeight: 'bold' }]}>Job ID : {code}</Text>
            </View>
          </View>

          <View style={styles.mainHeader}>
            <Image src={settings?.logoUrl || ''} style={{ height: '24px' }} />
            <Image src={logo} style={{ height: '24px' }} />
          </View>
          <CommonJobPdfDetails jobPdfData={data} dateAndTimeStampFormat={dateAndTimeStampFormat} />
          {checklist?.stages.map((stage) => {
            return (
              <View key={`${stage.id}`} break>
                <View style={styles.stageHeader}>
                  <ValueLabelGroup label="Stage :" value={`${stage.orderTree}`} />
                  <Text style={{ marginVertical: 8 }}>{stage.name}</Text>
                  <ValueLabelGroup label="Tasks :" value={`${stage.tasks.length}`} />
                </View>
                {(stage.tasks as unknown as Array<Task>).map((task, taskIndex: number) => (
                  <TaskView
                    activitiesById={activitiesById}
                    taskIndex={taskIndex}
                    dateFormat={dateFormat}
                    timeFormat={timeFormat}
                    dateAndTimeStampFormat={dateAndTimeStampFormat}
                    task={task}
                    key={task.id}
                  />
                ))}
              </View>
            );
          })}

          <View fixed style={styles.footer}>
            <Text style={styles.footerInfo}>
              Downloaded on {moment().format(dateAndTimeStampFormat)}. By {profile.firstName}{' '}
              {profile.lastName} ID: {profile.employeeId} for {selectedFacility!.id !== '-1' ? 'Facility: ' : ''}{selectedFacility?.name} using Leucine
              App
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

const MemoMyPrintJob = React.memo(MyPrintJob);

const PrintJob: FC<PrintJobProps> = ({ jobId }) => (
  <>
    <LoadingDiv>Loading...</LoadingDiv>
    {jobId && <MemoMyPrintJob jobId={jobId} />}
  </>
);

export default PrintJob;
