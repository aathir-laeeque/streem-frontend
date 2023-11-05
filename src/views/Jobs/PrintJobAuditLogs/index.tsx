import logo from '#assets/images/logo.png';
import { useTypedSelector } from '#store';
import { JobAuditLogType } from '#types';
import { setKeepPersistedData } from '#utils';
import { apiPrintJobActivity } from '#utils/apiUrls';
import { ALL_FACILITY_ID, DEFAULT_PAGE_NUMBER } from '#utils/constants';
import { InputTypes } from '#utils/globalTypes';
import { request } from '#utils/request';
import { formatDateTime } from '#utils/timeUtils';
import { jobActions } from '#views/Job/jobStore';
import { Document, Image, PDFViewer, Page, Text, View } from '@react-pdf/renderer';
import { getUnixTime } from 'date-fns';
import { groupBy } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CommonJobPdfDetails, PdfJobDataType } from '../Components/Documents/CommonJobPDFDetails';
import { LoadingDiv, styles } from './styles';
import { PrintJobAuditLogProps } from './types';

const MyPrintJobAuditLogs: FC<{ jobId: string }> = ({ jobId }) => {
  const [jobDetails, setJobDetails] = useState<PdfJobDataType | undefined>();
  const {
    auditLogs: { logs },
  } = useTypedSelector((state) => state.job);
  const { profile, settings, selectedFacility } = useTypedSelector((state) => state.auth);
  const { filters } = useTypedSelector((state) => state.auditLogFilters);
  const dispatch = useDispatch();

  useEffect(() => {
    setKeepPersistedData();
    const fetchJobPdfData = async () => {
      try {
        const response: { data: PdfJobDataType } = await request('GET', apiPrintJobActivity(jobId));
        fetchLogs();
        setJobDetails(response.data);
      } catch (err) {
        console.error('error from fetch job PDF data api ==>', err);
      }
    };

    if (jobId) {
      fetchJobPdfData();
    }
  }, []);

  const fetchLogs = (page = DEFAULT_PAGE_NUMBER, size = 250) => {
    dispatch(
      jobActions.getJobAuditLogs({
        jobId,
        params: { size, filters, sort: 'triggeredAt,desc', page },
      }),
    );
  };

  if (!logs || logs.length === 0 || !profile || !jobDetails) return null;

  const grouped: { [index: string]: JobAuditLogType[] } = groupBy(logs, 'triggeredOn');
  const data = Object.keys(grouped).map((item) => ({
    [`${item}`]: grouped[item],
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
          <CommonJobPdfDetails jobPdfData={jobDetails} />

          <View style={styles.container} break>
            {data.map((item) => {
              const day = formatDateTime({
                value: getUnixTime(new Date(Object.keys(item)[0])),
                type: InputTypes.DATE,
              });
              return (
                <View style={styles.columns} key={`name_${item.id}`}>
                  <View style={styles.logHeader}>
                    <Text style={styles.headerItemText}>{day}</Text>
                    <Text style={styles.headerItemText}>{item[item.id].length} activities</Text>
                  </View>
                  <View style={styles.logRow}>
                    {(item[item.id] as JobAuditLogType[]).map((log: JobAuditLogType) => {
                      const details = log?.details?.replace(
                        '{{{0}}}',
                        formatDateTime({
                          value: log?.parameters[0]?.value,
                          type: log?.parameters[0]?.type,
                        }),
                      );
                      return (
                        <View style={styles.logItem} key={`${log.id}`}>
                          <View style={styles.circle} />
                          <View style={styles.content} wrap={false}>
                            <Text style={styles.contentItems}>
                              {formatDateTime({ value: log.triggeredAt, type: InputTypes.TIME })}
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
                              {details}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>

          <View fixed style={styles.footer}>
            <Text style={styles.footerInfo}>
              Downloaded on {formatDateTime({ value: getUnixTime(new Date()) })}. By{' '}
              {profile.firstName} {profile.lastName} ID: {profile.employeeId} for{' '}
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

const MemoPrintJobAuditLogs = React.memo(MyPrintJobAuditLogs);

const PrintJobAuditLogs: FC<PrintJobAuditLogProps> = ({ jobId }) => (
  <>
    <LoadingDiv>Loading...</LoadingDiv>
    {jobId && <MemoPrintJobAuditLogs jobId={jobId} />}
  </>
);

export default PrintJobAuditLogs;
