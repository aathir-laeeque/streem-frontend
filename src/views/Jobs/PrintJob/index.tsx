import logo from '#assets/images/logo.png';
import { ParametersById, ParametersOrderInTaskInStage } from '#JobComposer/ActivityList/types';
import { Checklist, Task } from '#JobComposer/checklist.types';
import { getParameters } from '#JobComposer/utils';
import { useTypedSelector } from '#store';
import { setKeepPersistedData } from '#utils';
import { apiPrintJobDetails } from '#utils/apiUrls';
import { ALL_FACILITY_ID } from '#utils/constants';
import { request } from '#utils/request';
import { Document, Image, Page, PDFViewer, Text, View } from '@react-pdf/renderer';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { CommonJobPdfDetails, PdfJobDataType } from '../Components/Documents/CommonJobPDFDetails';
import { ValueLabelGroup } from '../Components/Documents/utils';
import { LoadingDiv, styles } from './styles';
import TaskView from './Task';
import { PrintJobProps } from './types';
import { keyBy } from 'lodash';

const MyPrintJob: FC<{ jobId: string }> = ({ jobId }) => {
  const [data, setData] = useState<PdfJobDataType | undefined>();
  const [parametersData, setParametersData] = useState<{
    parametersById: ParametersById;
    parametersOrderInTaskInStage: ParametersOrderInTaskInStage;
    hiddenIds: Record<string, boolean>;
    cjfParametersById: ParametersById;
  }>({
    parametersById: {},
    parametersOrderInTaskInStage: {},
    hiddenIds: {},
    cjfParametersById: {},
  });
  const { parametersById, hiddenIds, cjfParametersById } = parametersData;
  const { profile, settings, selectedFacility } = useTypedSelector((state) => state.auth);

  const { dateAndTimeStampFormat, timeFormat, dateFormat } = useTypedSelector(
    (state) => state.facilityWiseConstants[selectedFacility!.id],
  );

  useEffect(() => {
    setKeepPersistedData();
    const fetchJobPdfData = async () => {
      try {
        const response: { data: PdfJobDataType } = await request('GET', apiPrintJobDetails(jobId));
        setParametersData({
          ...getParameters({ checklist: response.data.checklist as unknown as Checklist }),
          cjfParametersById: { ...keyBy(response.data.parameterValues || [], 'id') },
        });
        setData(response.data);
      } catch (err) {
        console.error('error from fetch job PDF data api ==>', err);
      }
    };

    if (jobId) {
      fetchJobPdfData();
    }
  }, []);

  if (!data || !profile || !Object.keys(parametersById).length) return null;

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
            if (hiddenIds[stage.id] === undefined) {
              return (
                <View key={`${stage.id}`} break>
                  <View style={styles.stageHeader}>
                    <ValueLabelGroup label="Stage :" value={`${stage.orderTree}`} />
                    <Text style={{ marginVertical: 8 }}>{stage.name}</Text>
                    <ValueLabelGroup label="Tasks :" value={`${stage.tasks.length}`} />
                  </View>
                  {(stage.tasks as unknown as Array<Task>).map((task, taskIndex: number) => {
                    if (hiddenIds[task.id] === undefined) {
                      return (
                        <TaskView
                          parametersById={parametersById}
                          taskIndex={taskIndex}
                          dateFormat={dateFormat}
                          timeFormat={timeFormat}
                          dateAndTimeStampFormat={dateAndTimeStampFormat}
                          task={task}
                          key={task.id}
                          hiddenIds={hiddenIds}
                          cjfParametersById={cjfParametersById}
                        />
                      );
                    }
                  })}
                </View>
              );
            }
          })}

          <View fixed style={styles.footer}>
            <Text style={styles.footerInfo}>
              Downloaded on {moment().format(dateAndTimeStampFormat)}. By {profile.firstName}{' '}
              {profile.lastName} ID: {profile.employeeId} for{' '}
              {selectedFacility!.id !== ALL_FACILITY_ID ? 'Facility: ' : ''}
              {selectedFacility?.name} using Leucine App
            </Text>
            <View style={styles.pageInfo}>
              <Text
                style={{ fontSize: 10, minHeight: 10 }}
                render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
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
