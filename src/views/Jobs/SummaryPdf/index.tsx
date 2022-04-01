import { useTypedSelector } from '#store';
import { apiGetJobSummary, apiPrintJobDetails } from '#utils/apiUrls';
import { request } from '#utils/request';
import { RouteComponentProps } from '@reach/router';
import { Document, Page, PDFViewer, View } from '@react-pdf/renderer';
import React, { useEffect, useState } from 'react';
import {
  CommonJobPdfDetails,
  PdfJobDataType,
} from '../Components/Documents/CommonJobPDFDetails';
import { Job } from '../NewListView/types';
import { JobSummary } from '../Summary/types';
import DurationSummary from './DurationSummary';
import ExceptionSummary from './ExceptionSummary';
import Footer from './Footer';
import Header from './Header';
import { styles } from './styles';

type Props = RouteComponentProps<{ jobId: Job['id'] }>;

type State = {
  loading: boolean;
  jobSummaryData: JobSummary | null;
  jobDetails: PdfJobDataType | null;
};

const JobSummaryPdf = ({ jobId }: Props) => {
  const { profile, settings, selectedFacility } = useTypedSelector(
    (state) => state.auth,
  );

  const { timeStampFormat } = useTypedSelector(
    (state) => state.facilityWiseConstants[selectedFacility!.id],
  );

  const [{ loading, jobSummaryData, jobDetails }, setState] = useState<State>({
    loading: false,
    jobSummaryData: null,
    jobDetails: null,
  });

  useEffect(() => {
    (async () => {
      try {
        setState((prevState) => ({
          ...prevState,
          loading: !prevState.loading,
        }));

        if (jobId) {
          const jobSummaryResponse = await request(
            'GET',
            apiGetJobSummary(jobId as string),
          );

          const jobDetailsApiRespone: { data: PdfJobDataType } = await request(
            'GET',
            apiPrintJobDetails(jobId),
          );

          if (jobSummaryResponse.data) {
            setState((prevState) => ({
              ...prevState,
              loading: !prevState.loading,
              jobSummaryData: jobSummaryResponse.data,
              jobDetails: jobDetailsApiRespone.data,
            }));
          } else {
            console.error(
              'error in api response :: ',
              jobSummaryResponse?.errors,
            );
            setState((prevState) => ({
              ...prevState,
              loading: !prevState.loading,
            }));
          }
        }
      } catch (error) {
        console.error('error occurred in api call :: ', error);
      }
    })();
  }, []);

  if (loading || !jobSummaryData || !jobDetails || !profile) {
    return null;
  }

  return (
    <PDFViewer style={{ width: '100%', height: '100%' }}>
      <Document>
        <Page style={styles.page}>
          <Header logoUrl={settings?.logoUrl ?? ''} />

          <CommonJobPdfDetails
            jobPdfData={jobDetails}
            timeStampFormat={timeStampFormat}
          />
          <View style={styles.container}>
            <DurationSummary
              stages={jobSummaryData?.stages ?? []}
              totalStageDuration={jobSummaryData?.totalStageDuration ?? 0}
              totalTaskExceptions={jobSummaryData?.totalTaskExceptions ?? 0}
            />

            <ExceptionSummary
              stages={jobSummaryData?.stages ?? []}
              totalTaskExceptions={jobSummaryData?.totalTaskExceptions ?? 0}
            />
          </View>

          <Footer user={profile} />
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default JobSummaryPdf;
